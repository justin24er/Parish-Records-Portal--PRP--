// frontend/src/pages/vitabu/VitabuPage.jsx
// "Vitabu vya Kanisa" — the parish's church registry books (Baptism,
// Confirmation, Marriage, Funeral, etc). Each book is a category that holds
// scanned register pages / certificates, captured either via camera or
// uploaded as files. English labels are shown alongside the Swahili ones so
// any admin — regardless of first language — understands what each book is for.

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  BookOpen, Camera, FileText, Droplets, Heart, Cross,
  Users, ChevronRight, X, Loader2, Download, Trash2,
} from 'lucide-react';

import { vitabuService, documentService } from '../../services/api';
import CameraCapture from '../../components/ui/CameraCapture';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { formatDateTime } from '../../utils/helpers';

const BOOK_ICONS = {
  ubatizo: Droplets,
  kipaimara: Cross,
  ekaristi: BookOpen,
  ndoa: Heart,
  upadre: Users,
  mazishi: FileText,
};

export default function VitabuPage() {
  const [vitabu, setVitabu]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeBook, setActiveBook]   = useState(null); // kitabu opened for detail view
  const [documents, setDocuments]     = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [cameraOpen, setCameraOpen]   = useState(false);
  const [uploading, setUploading]     = useState(false);

  const loadVitabu = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vitabuService.list();
      setVitabu(res.data.vitabu);
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kupakia vitabu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadVitabu(); }, [loadVitabu]);

  async function openBook(book) {
    setActiveBook(book);
    setDocsLoading(true);
    try {
      const res = await documentService.list({ kitabuId: book.id });
      setDocuments(res.data.documents);
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kupakia nyaraka.');
    } finally {
      setDocsLoading(false);
    }
  }

  async function handleCapture(file, { source }) {
    if (!activeBook) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('kitabuId', activeBook.id);
    formData.append('ownerType', 'kitabu');
    formData.append('source', source);
    try {
      const res = await documentService.upload(formData);
      setDocuments((prev) => [res.data.document, ...prev]);
      setVitabu((prev) => prev.map((b) => (b.id === activeBook.id ? { ...b, document_count: b.document_count + 1 } : b)));
      toast.success('Hati imehifadhiwa kikamilifu.');
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kuhifadhi hati.');
    } finally {
      setUploading(false);
    }
  }

  async function removeDocument(id) {
    try {
      await documentService.remove(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setVitabu((prev) => prev.map((b) => (b.id === activeBook.id ? { ...b, document_count: Math.max(0, b.document_count - 1) } : b)));
      toast.success('Hati imefutwa.');
    } catch (err) {
      toast.error(err.message || 'Imeshindwa kufuta hati.');
    }
  }

  return (
    <div>
      <header style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)' }}>
          Vitabu vya Kanisa
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Church Registry Books — kila kitabu kina kumbukumbu na nyaraka za sakramenti husika, zilizopangwa vizuri kwa urahisi wa kutafuta.
        </p>
      </header>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
          <Loader2 className="spin" size={28} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {vitabu.map((book) => {
            const Icon = BOOK_ICONS[book.code] || BookOpen;
            return (
              <motion.button
                key={book.id}
                onClick={() => openBook(book)}
                whileHover={{ y: -3 }}
                className="card"
                style={{ textAlign: 'left', padding: 'var(--space-5)', cursor: 'pointer', border: '1px solid var(--color-border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
                </div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {book.name_sw}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {book.name_en}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)' }}>
                  {book.document_count} {book.document_count === 1 ? 'hati' : 'hati'} zilizopakiwa
                </p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Book detail modal */}
      <Modal
        open={!!activeBook}
        onClose={() => setActiveBook(null)}
        title={activeBook ? `${activeBook.name_sw} (${activeBook.name_en})` : ''}
        maxWidth={640}
      >
        {activeBook && (
          <div>
            <button className="btn btn-primary" style={{ marginBottom: 'var(--space-4)' }} onClick={() => setCameraOpen(true)} disabled={uploading}>
              <Camera size={16} /> Piga Picha / Pakia Hati Mpya
            </button>

            {docsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-6)' }}>
                <Loader2 className="spin" size={22} />
              </div>
            ) : documents.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Hakuna hati bado"
                description="Piga picha ya ukurasa wa kitabu au cheti, au pakia faili kuanza kuhifadhi hati za kitabu hiki."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {documents.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <FileText size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.file_name}
                      </p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {doc.source === 'camera' ? 'Ilipigwa picha' : 'Ilipakiwa'} · {formatDateTime(doc.created_at)}
                      </p>
                    </div>
                    <a href={documentService.fileUrl(doc.id)} target="_blank" rel="noreferrer" className="btn btn-icon btn-ghost" title="Pakua">
                      <Download size={16} />
                    </a>
                    <button className="btn btn-icon btn-ghost" onClick={() => removeDocument(doc.id)} title="Futa">
                      <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <CameraCapture
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCapture}
        title={activeBook ? `Hati kwa: ${activeBook.name_sw}` : 'Piga Picha ya Hati'}
      />
    </div>
  );
}
