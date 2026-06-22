import Link from "next/link";
import { CheckSquare } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <nav>
        <Link 
          href="#" 
          className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1" 
          style={{ textDecoration: "none" }}
        >
          <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <CheckSquare size={20} className="text-indigo-400" />
          </div>
          <span className="text-xl font-bold text-white">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="#features">Funcionalidades</Link>
          <Link href="#como-funciona">Como funciona</Link>
          <Link href="#tecnologias">Tecnologias</Link>
        </div>
        <div className="nav-cta">
          <Link href="/login" className="btn-ghost">Entrar</Link>
          <Link href="/register" className="btn-primary">Começar grátis</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <div className="hero-badge-dot"></div>
          Gestão de tarefas moderna e eficiente
        </div>

        <h1>Organize seu fluxo.<br /><span>Entregue com clareza.</span></h1>
        <p className="hero-sub">
          TaskFlow reúne tarefas, kanban e calendário em um único lugar.
          Acompanhe o progresso, defina prioridades e nunca perca um prazo.
        </p>

        <div className="hero-actions">
          <Link href="/register" className="btn-primary btn-lg">Criar conta gratuita</Link>
          <Link href="#features" className="btn-outline-lg">Ver funcionalidades</Link>
        </div>

        {/* APP MOCKUP */}
        <div className="mockup-wrapper">
          <div className="mockup-bar">
            <div className="dot dot-red"></div>
            <div className="dot dot-yellow"></div>
            <div className="dot dot-green"></div>
            <div className="mockup-nav">
              <span>Dashboard</span>
              <span className="active">Tarefas</span>
              <span>Kanban</span>
              <span>Calendário</span>
            </div>
          </div>
          <div className="mockup-body">
            <div className="mockup-header">
              <div>
                <div className="mockup-title">Minhas tarefas</div>
                <div className="mockup-sub">Gerencie e acompanhe suas tarefas</div>
              </div>
              <button className="mockup-new-btn">+ Nova tarefa</button>
            </div>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-num">12</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: "var(--yellow)" }}>5</div>
                <div className="stat-label">Pendentes</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: "var(--green)" }}>6</div>
                <div className="stat-label">Concluídas</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: "var(--red)" }}>1</div>
                <div className="stat-label">Vencidas</div>
              </div>
            </div>
            <div className="task-grid">
              <div className="task-card">
                <div className="task-badges">
                  <span className="badge badge-alta">● Alta</span>
                  <span className="badge badge-progresso">◎ Em progresso</span>
                </div>
                <div className="task-name">Redesign do dashboard</div>
                <div className="task-desc">Atualizar layout e paleta de cores</div>
                <div className="task-date">📅 25 de jun. de 2026</div>
              </div>
              <div className="task-card">
                <div className="task-badges">
                  <span className="badge badge-media">● Média</span>
                  <span className="badge badge-concluida">✓ Concluída</span>
                </div>
                <div className="task-name">Integração com Firebase</div>
                <div className="task-desc">Configurar auth e Firestore</div>
                <div className="task-date">📅 20 de jun. de 2026</div>
              </div>
              <div className="task-card">
                <div className="task-badges">
                  <span className="badge badge-media">● Média</span>
                  <span className="badge badge-pendente">○ Pendente</span>
                  <span className="badge badge-vencida">⚠ Vencida</span>
                </div>
                <div className="task-name">Página de relatórios</div>
                <div className="task-desc">Gráficos de produtividade semanal</div>
                <div className="task-date expired">📅 10 de jun. de 2026</div>
              </div>
              <div className="task-card">
                <div className="task-badges">
                  <span className="badge badge-alta">● Alta</span>
                  <span className="badge badge-pendente">○ Pendente</span>
                </div>
                <div className="task-name">Quadro Kanban</div>
                <div className="task-desc">Drag & drop entre colunas</div>
                <div className="task-date">📅 30 de jun. de 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <div className="section" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className="stats-banner">
          <div className="stat-banner-item">
            <div className="stat-banner-num">100%</div>
            <div className="stat-banner-label">Gratuito para uso</div>
          </div>
          <div className="stat-banner-item">
            <div className="stat-banner-num">3</div>
            <div className="stat-banner-label">Visualizações integradas</div>
          </div>
          <div className="stat-banner-item">
            <div className="stat-banner-num">∞</div>
            <div className="stat-banner-label">Tarefas e sub-tarefas</div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-label">Funcionalidades</div>
        <h2 className="section-title">Tudo que você precisa<br />em um só lugar</h2>
        <p className="section-desc">Do cadastro à conclusão, o TaskFlow acompanha cada etapa com clareza e organização.</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h4" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-title">CRUD completo de tarefas</div>
            <div className="feature-desc">Crie, edite e exclua tarefas com título, descrição, prazo e prioridade. Adicione sub-tarefas com barra de progresso automática.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 17h7M17 14v6" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-title">Quadro Kanban interativo</div>
            <div className="feature-desc">Arraste e solte tarefas entre "A Fazer", "Fazendo" e "Concluído" com atualização em tempo real via Dnd Kit.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-title">Visualização em calendário</div>
            <div className="feature-desc">Veja todas as suas tarefas por data com FullCalendar. Clique em qualquer evento para abrir os detalhes completos.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-title">Dashboard com métricas</div>
            <div className="feature-desc">Gráficos de distribuição por status, prioridade e atividade semanal. Dados sempre atualizados em tempo real.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" stroke="var(--accent-light)" fill="none" strokeWidth="2"/></svg>
            </div>
            <div className="feature-title">Autenticação segura</div>
            <div className="feature-desc">Login com e-mail, Google ou GitHub via Firebase Auth. Rotas protegidas e confirmação de e-mail incluída.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="var(--accent-light)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="feature-title">Acessibilidade digital</div>
            <div className="feature-desc">Recursos como VLibras, temas visuais e navegação por teclado para garantir que todos possam usar o TaskFlow.</div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <section className="section" id="como-funciona">
        <div className="section-label">Como funciona</div>
        <h2 className="section-title">Simples de começar,<br />poderoso para crescer</h2>

        <div className="steps-wrapper">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-content">
              <div className="step-title">Crie sua conta em segundos</div>
              <div className="step-desc">Cadastre-se com e-mail ou use login social via Google ou GitHub. A confirmação de e-mail garante a segurança da sua conta.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-content">
              <div className="step-title">Adicione suas tarefas</div>
              <div className="step-desc">Defina título, descrição, data de vencimento e prioridade. Quebre tarefas complexas em sub-tarefas e acompanhe o progresso com uma barra visual.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-content">
              <div className="step-title">Visualize do jeito que preferir</div>
              <div className="step-desc">Alterne entre lista de tarefas, quadro Kanban com drag & drop ou calendário mensal — tudo sincronizado automaticamente.</div>
            </div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-content">
              <div className="step-title">Acompanhe com o Dashboard</div>
              <div className="step-desc">Visualize métricas-chave, gráficos de produtividade e a atividade dos últimos 7 dias para tomar decisões com base em dados reais.</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* TECH STACK */}
      <section className="section" id="tecnologias">
        <div className="section-label">Stack tecnológico</div>
        <h2 className="section-title">Construído com<br />tecnologias modernas</h2>
        <p className="section-desc">Cada ferramenta foi escolhida para garantir performance, escalabilidade e uma experiência de desenvolvimento excelente.</p>

        <div className="tech-grid">
          <span className="tech-pill highlight">Next.js</span>
          <span className="tech-pill highlight">TypeScript</span>
          <span className="tech-pill highlight">Tailwind CSS</span>
          <span className="tech-pill highlight">Firebase</span>
          <span className="tech-pill">Tremor</span>
          <span className="tech-pill">FullCalendar</span>
          <span className="tech-pill">Dnd Kit</span>
          <span className="tech-pill">Framer Motion</span>
          <span className="tech-pill">React Hook Form</span>
          <span className="tech-pill">Zod</span>
          <span className="tech-pill">Lucide React</span>
          <span className="tech-pill">Sonner</span>
          <span className="tech-pill">Next Themes</span>
          <span className="tech-pill">Aceternity UI</span>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2 className="cta-title">Pronto para organizar<br />seu fluxo de trabalho?</h2>
          <p className="cta-desc">Comece agora, é gratuito. Nenhum cartão de crédito necessário.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary btn-lg">Criar minha conta</Link>
            <Link href="/login" className="btn-outline-lg">Já tenho uma conta</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}