import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Upload } from 'lucide-react';
import './InlineFieldEditor.css';

/**
 * Reusable modal for inline editing.
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onSave - async (data) => void
 * @param {string} title - modal title
 * @param {object} initialData - key-value pairs
 * @param {array} fields - [{ name, label, type, placeholder }]
 */
const InlineFieldEditor = ({ isOpen, onClose, onSave, title, initialData, fields }) => {
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRefs = useRef({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleMacClose = (event) => {
      if (!isOpen || isSaving) return;
      event.detail?.handle?.();
      onClose();
    };

    window.addEventListener('mac-window-close', handleMacClose);
    return () => window.removeEventListener('mac-window-close', handleMacClose);
  }, [isOpen, isSaving, onClose]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (name, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(name, reader.result); // Base64/data URL string
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  const editor = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ife-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && !isSaving && onClose()}
        >
          <motion.div
            className="ife-modal glass"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="ife-header">
              <h3>{title}</h3>
              <button className="ife-close" onClick={onClose} disabled={isSaving}>
                <X size={18} />
              </button>
            </div>

            <form id="ife-form" onSubmit={handleSave} className="ife-form">
              {fields.map((field) => (
                <div className="ife-field" key={field.name}>
                  <label>{field.label || field.name}</label>

                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                    />
                  ) : field.type === 'image' ? (
                    <div className="ife-image-upload">
                      {formData[field.name] && (
                        <div className="ife-image-preview" style={{ backgroundImage: `url(${formData[field.name]})` }} />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[field.name] = el)}
                        onChange={(e) => handleFileUpload(field.name, e)}
                      />
                      <button
                        type="button"
                        className="ife-btn-upload"
                        onClick={() => fileInputRefs.current[field.name]?.click()}
                      >
                        <Upload size={16} />
                        {formData[field.name] ? 'Change Image' : 'Upload Image'}
                      </button>
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="ife-file-upload">
                      <input
                        type="file"
                        accept={field.accept || '*/*'}
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[field.name] = el)}
                        onChange={(e) => handleFileUpload(field.name, e)}
                      />
                      <button
                        type="button"
                        className="ife-btn-upload"
                        onClick={() => fileInputRefs.current[field.name]?.click()}
                      >
                        <Upload size={16} />
                        {formData[field.name] ? 'Change Resume' : 'Upload Resume'}
                      </button>
                      {formData[field.name] && (
                        <a href={formData[field.name]} target="_blank" rel="noreferrer" className="ife-file-link">
                          Open current file
                        </a>
                      )}
                      <input
                        type="text"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        placeholder={field.placeholder || 'Resume URL or uploaded file data'}
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </form>

            <div className="ife-actions">
              <button type="button" className="ife-btn-cancel" onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button type="submit" form="ife-form" className="ife-btn-save" disabled={isSaving}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(editor, document.body);
};

export default InlineFieldEditor;
