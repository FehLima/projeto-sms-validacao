import { useState, useEffect } from 'react';
import './AdminPanel.css';
import { loginAdmin, listarLeads } from './services/api';

function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [leads, setLeads] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const carregarLeads = async (tokenAtual) => {
    setCarregando(true);
    const resposta = await listarLeads(tokenAtual);
    setCarregando(false);
    if (resposta.sucesso) {
      setLeads(resposta.leads);
    } else {
      localStorage.removeItem('admin_token');
      setToken('');
    }
  };

  useEffect(() => {
    if (token) carregarLeads(token);
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    const resposta = await loginAdmin(senha);
    if (resposta.sucesso) {
      localStorage.setItem('admin_token', resposta.token);
      setToken(resposta.token);
    } else {
      setErro('Senha incorreta');
    }
  };

  const handleSair = () => {
    localStorage.removeItem('admin_token');
    setToken('');
  };

  if (!token) {
    return (
      <div className="admin-login-container">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h2>Painel Administrativo</h2>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          {erro && <p className="admin-erro">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Leads recebidos</h2>
        <div>
          <button onClick={() => carregarLeads(token)} className="admin-botao-secundario">
            Atualizar
          </button>
          <button onClick={handleSair} className="admin-botao-secundario">
            Sair
          </button>
        </div>
      </div>

      {carregando && <p>Carregando...</p>}
      {!carregando && leads.length === 0 && <p>Nenhum lead recebido ainda.</p>}

      {!carregando && leads.length > 0 && (
        <table className="admin-tabela">
          <thead>
            <tr>
              <th>Telefone</th>
              <th>CNPJ</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={i}>
                <td>{lead.telefone}</td>
                <td>{lead.cnpj}</td>
                <td>{new Date(lead.data).toLocaleString('pt-BR')}</td>
                <td>
                  <span className={`admin-status ${lead.status === 'validado' ? 'validado' : 'pendente'}`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPanel;