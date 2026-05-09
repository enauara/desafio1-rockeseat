import { useState, useEffect } from 'react';
import { Link2, Download, ExternalLink, Trash2, Copy } from 'lucide-react';
import './App.css';

interface LinkItem {
  id: string;
  originalUrl: string;
  shortCode: string;
  visitCount: number;
}

export function App() {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);

  async function handleCreateLink(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3333/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_url: url,
          short_code: code
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar link');
      }

      await fetchLinks();
      alert('Link criado com sucesso!');
      setUrl('');   
      setCode('');
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

 async function fetchLinks() {
    try {
      const response = await fetch('http://localhost:3333/links');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Erro ao buscar links:", error);
    }
  }

  async function handleDeleteLink(id: string) {

    if (!confirm('Tem certeza que deseja excluir este link?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3333/links/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o link');
      }

      fetchLinks(); 
      
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleCopyLink(shortCode: string) {
    const fullLink = `http://localhost:3333/${shortCode}`;
    
    try {
      await navigator.clipboard.writeText(fullLink);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <>
    <div className="layout">
        <div className="logo-container">
          <Link2 size={32} color="#2b4cc9" strokeWidth={3} />
          <h2>brev.ly</h2>
        </div>

        <div className="main-grid">
          <div className="card">
            <h3>Novo link</h3>
            <form onSubmit={handleCreateLink}>
              <div className="input-group">
                <label>Link Original</label>
                <input 
                  type="url" 
                  placeholder="https://www.exemplo.com.br"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Link Encurtado</label>
                <input 
                  type="text" 
                  placeholder="brev.ly/"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-save" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar link'}
              </button>
            </form>
          </div>

          <div className="card">
            {isLoading && (
              <div className="progress-bar-container">
                <div className="progress-bar-fill"></div>
              </div>
            )}
            <div className="card-header-actions">
              <h3>Meus links</h3>
              <button className="btn-csv" onClick={() => window.location.href = 'http://localhost:3333/links/export'}>
                <Download size={14} />
                Baixar CSV
              </button>
            </div>
            <hr style={{ border: '0', borderTop: '1px solid #f3f4f6', marginBottom: '40px' }} />
            
            {links.length === 0 ? (
              <div className="empty-state">
                <Link2 size={40} color="#e5e7eb" />
                <p>Ainda não existem links cadastrados</p>
              </div>
            ) : (
              <div className="links-list">
                {links.map((link) => (
                  <div key={link.id} className="link-item">
                    <div className="link-info">
                      <span className="link-short">brev.ly/{link.shortCode}</span>
                      <span className="link-original">{link.originalUrl}</span>
                    </div>
                    <div className="link-actions">
                      <span>{link.visitCount} cliques</span>
                      <a href={`http://localhost:3333/${link.shortCode}`} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} color="#105aed" />
                      </a>
                    </div>
                    <button 
                      onClick={() => handleCopyLink(link.shortCode)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Copiar link"
                    >
                      <Copy size={16} color="#6b7280" />
                    </button>
                    <button 
                    onClick={() => handleDeleteLink(link.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                    title="Excluir link"
                  >
                    <Trash2 size={16} color="#f00505" />
                  </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}