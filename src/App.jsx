import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Eye,
  KeyRound,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  initialAuditEvents,
  initialClients,
  initialManagedAccounts,
  initialManagerAccounts,
  initialUsers,
  permissions,
  profiles,
} from './data/mockData';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'gestoras', label: 'Contas Gestoras', icon: Building2 },
  { id: 'gerenciadas', label: 'Contas Gerenciadas', icon: ShieldCheck },
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'clientes', label: 'Clientes', icon: ClipboardList },
  { id: 'perfis', label: 'Perfis', icon: SlidersHorizontal },
  { id: 'permissoes', label: 'Permissões', icon: KeyRound },
  { id: 'auditoria', label: 'Auditoria', icon: Activity },
];

const pageCopy = {
  dashboard: {
    title: 'Dashboard Executivo',
    description: 'Visão consolidada de onboarding, relacionamento, acesso e governança.',
  },
  gestoras: {
    title: 'Contas Gestoras',
    description: 'Crie e acompanhe empresas responsáveis por carteiras vinculadas.',
  },
  gerenciadas: {
    title: 'Contas Gerenciadas',
    description: 'Crie contas operacionais e vincule cada uma a uma conta gestora.',
  },
  usuarios: {
    title: 'Usuários',
    description: 'Crie usuários, defina perfil e associe a uma conta gerenciada.',
  },
  clientes: {
    title: 'Clientes',
    description: 'Crie clientes e associe cada cadastro ao responsável operacional.',
  },
  perfis: {
    title: 'Perfis',
    description: 'Perfis simulados para estruturar a governança de acesso.',
  },
  permissoes: {
    title: 'Permissões',
    description: 'Matriz inicial das permissões principais do MVP.',
  },
  auditoria: {
    title: 'Auditoria',
    description: 'Eventos simulados de contas, vínculos, usuários e clientes.',
  },
};

const profileOptions = ['Administrador', 'Operacional', 'Consulta'];

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [managerAccounts, setManagerAccounts] = useState(initialManagerAccounts);
  const [managedAccounts, setManagedAccounts] = useState(initialManagedAccounts);
  const [users, setUsers] = useState(initialUsers);
  const [clients, setClients] = useState(initialClients);
  const [auditEvents, setAuditEvents] = useState(initialAuditEvents);
  const [viewMode, setViewMode] = useState('manager');
  const [viewAccountId, setViewAccountId] = useState(initialManagerAccounts[0]?.id || '');

  const lookups = useMemo(
    () => ({
      managers: Object.fromEntries(managerAccounts.map((account) => [account.id, account])),
      managed: Object.fromEntries(managedAccounts.map((account) => [account.id, account])),
      users: Object.fromEntries(users.map((user) => [user.id, user])),
    }),
    [managerAccounts, managedAccounts, users],
  );

  const rows = useMemo(
    () => buildRows({ managerAccounts, managedAccounts, users, clients, auditEvents, lookups }),
    [managerAccounts, managedAccounts, users, clients, auditEvents, lookups],
  );

  const visibleClients = useMemo(() => {
    if (viewMode === 'manager') {
      const managedIds = managedAccounts
        .filter((account) => account.managerId === viewAccountId)
        .map((account) => account.id);
      return rows.clients.filter((client) => managedIds.includes(client.managedAccountId));
    }

    return rows.clients.filter((client) => client.managedAccountId === viewAccountId);
  }, [managedAccounts, rows.clients, viewAccountId, viewMode]);

  function addAudit(event, target) {
    setAuditEvents((current) => [
      {
        id: nextId('EV', current.length + 5001),
        event,
        actor: 'Sistema MVP',
        target,
        time: 'Agora',
      },
      ...current,
    ]);
  }

  function createManagerAccount(values) {
    const account = {
      id: nextId('GA', managerAccounts.length + 1001),
      name: values.name,
      segment: values.segment,
      status: 'Ativa',
    };
    setManagerAccounts((current) => [...current, account]);
    addAudit('Conta gestora criada', account.name);
  }

  function createManagedAccount(values) {
    const account = {
      id: nextId('MA', managedAccounts.length + 2001),
      name: values.name,
      managerId: values.managerId,
      owner: values.owner,
      status: 'Onboarding',
      risk: values.risk,
    };
    const managerName = lookups.managers[values.managerId]?.name || 'Conta gestora';
    setManagedAccounts((current) => [...current, account]);
    addAudit('Conta gerenciada criada', account.name);
    addAudit('Vínculo criado', `${account.name} -> ${managerName}`);
  }

  function createUser(values) {
    const user = {
      id: nextId('US', users.length + 3001),
      name: values.name,
      email: values.email,
      managedAccountId: values.managedAccountId,
      profile: values.profile,
      status: 'Ativo',
    };
    setUsers((current) => [...current, user]);
    addAudit('Usuário criado', user.name);
  }

  function createClient(values) {
    const client = {
      id: nextId('CL', clients.length + 4001),
      name: values.name,
      tier: values.tier,
      managedAccountId: values.managedAccountId,
      ownerUserId: values.ownerUserId,
      health: 'Saudável',
    };
    setClients((current) => [...current, client]);
    addAudit('Cliente criado', client.name);
  }

  function changeViewMode(nextMode) {
    setViewMode(nextMode);
    setViewAccountId(
      nextMode === 'manager' ? managerAccounts[0]?.id || '' : managedAccounts[0]?.id || '',
    );
  }

  const currentPage = pageCopy[activePage];
  const pageContent = {
    dashboard: (
      <Dashboard
        clients={rows.clients}
        managedAccounts={rows.managedAccounts}
        auditEvents={auditEvents}
        visibleClients={visibleClients}
        viewAccountId={viewAccountId}
        viewMode={viewMode}
        onViewAccountChange={setViewAccountId}
        onViewModeChange={changeViewMode}
        managerAccounts={managerAccounts}
        managedRaw={managedAccounts}
      />
    ),
    gestoras: (
      <CrudPage
        form={<ManagerForm onSubmit={createManagerAccount} />}
        summary={[
          ['Contas gestoras', managerAccounts.length],
          ['Contas ativas', managerAccounts.filter((item) => item.status === 'Ativa').length],
          ['Gerenciadas vinculadas', managedAccounts.length],
        ]}
        tableTitle="Contas gestoras cadastradas"
        rows={rows.managerAccounts}
        columns={['id', 'name', 'segment', 'managedCount', 'clientCount', 'status']}
        headers={['ID', 'Conta gestora', 'Segmento', 'Gerenciadas', 'Clientes visíveis', 'Status']}
      />
    ),
    gerenciadas: (
      <CrudPage
        form={<ManagedForm managers={managerAccounts} onSubmit={createManagedAccount} />}
        summary={[
          ['Contas gerenciadas', managedAccounts.length],
          ['Vínculos ativos', managedAccounts.filter((item) => item.managerId).length],
          ['Em onboarding', managedAccounts.filter((item) => item.status === 'Onboarding').length],
        ]}
        tableTitle="Relacionamento entre contas"
        rows={rows.managedAccounts}
        columns={['id', 'name', 'managerName', 'owner', 'status', 'risk']}
        headers={['ID', 'Conta gerenciada', 'Conta gestora', 'Responsável', 'Status', 'Risco']}
      />
    ),
    usuarios: (
      <CrudPage
        form={<UserForm managedAccounts={managedAccounts} onSubmit={createUser} />}
        summary={[
          ['Usuários', users.length],
          ['Administradores', users.filter((item) => item.profile === 'Administrador').length],
          ['Operacionais', users.filter((item) => item.profile === 'Operacional').length],
        ]}
        tableTitle="Usuários por conta gerenciada"
        rows={rows.users}
        columns={['id', 'name', 'email', 'managedAccountName', 'profile', 'status']}
        headers={['ID', 'Usuário', 'Email', 'Conta gerenciada', 'Perfil', 'Status']}
      />
    ),
    clientes: (
      <CrudPage
        form={<ClientForm users={users} managedAccounts={managedAccounts} onSubmit={createClient} />}
        summary={[
          ['Clientes', clients.length],
          ['Enterprise', clients.filter((item) => item.tier === 'Enterprise').length],
          ['Saudáveis', clients.filter((item) => item.health === 'Saudável').length],
        ]}
        tableTitle="Carteira de clientes"
        rows={rows.clients}
        columns={['id', 'name', 'tier', 'managedAccountName', 'ownerName', 'health']}
        headers={['ID', 'Cliente', 'Categoria', 'Conta gerenciada', 'Responsável', 'Saúde']}
      />
    ),
    perfis: (
      <ReadOnlyPage
        rows={profiles}
        columns={['name', 'scope', 'permissions']}
        headers={['Perfil', 'Escopo', 'Permissões']}
      />
    ),
    permissoes: (
      <ReadOnlyPage
        rows={permissions}
        columns={['module', 'action', 'profile', 'status']}
        headers={['Módulo', 'Ação', 'Perfil', 'Status']}
      />
    ),
    auditoria: (
      <ReadOnlyPage
        rows={auditEvents}
        columns={['event', 'actor', 'target', 'time']}
        headers={['Evento', 'Responsável', 'Alvo', 'Horário']}
      />
    ),
  }[activePage];

  return (
    <div className="min-h-screen bg-cloud text-ink">
      <Sidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(page) => {
          setActivePage(page);
          setSidebarOpen(false);
        }}
      />

      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <section className="mb-7 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-brand">MVP com dados locais</p>
              <h1 className="text-2xl font-semibold tracking-normal text-ink sm:text-3xl">
                {currentPage.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slateui">
                {currentPage.description}
              </p>
            </div>
            <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-700">
              <CheckCircle2 size={17} />
              Fluxo simulado
            </button>
          </section>

          {pageContent}
        </main>
      </div>
    </div>
  );
}

function Dashboard({
  clients,
  managedAccounts,
  auditEvents,
  visibleClients,
  viewMode,
  viewAccountId,
  onViewModeChange,
  onViewAccountChange,
  managerAccounts,
  managedRaw,
}) {
  const selectedOptions = viewMode === 'manager' ? managerAccounts : managedRaw;

  return (
    <div className="space-y-6">
      <ProjectIntro />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Contas gerenciadas" value={managedAccounts.length} trend="+ local" tone="brand" />
        <MetricCard label="Clientes na carteira" value={clients.length} trend="simulado" tone="teal" />
        <MetricCard label="Eventos auditados" value={auditEvents.length} trend="agora" tone="amber" />
        <MetricCard label="Clientes visíveis" value={visibleClients.length} trend="regra" tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <HowItWorks />
        <AppliedRules />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Contas gerenciadas recentes" action="Ver todas">
          <DataTable
            rows={managedAccounts}
            columns={['id', 'name', 'managerName', 'status', 'risk']}
            headers={['ID', 'Conta', 'Gestora', 'Status', 'Risco']}
          />
        </Panel>

        <Panel title="Simulação de visibilidade">
          <div className="space-y-4 p-5">
            <SegmentedControl
              value={viewMode}
              options={[
                ['manager', 'Conta Gestora'],
                ['managed', 'Conta Gerenciada'],
              ]}
              onChange={onViewModeChange}
            />
            <SelectField
              label="Contexto"
              value={viewAccountId}
              onChange={onViewAccountChange}
              options={selectedOptions.map((item) => [item.id, item.name])}
            />
            <div className="rounded-md border border-line bg-cloud p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <Eye size={17} />
                Carteira permitida
              </div>
              <p className="text-xs leading-5 text-slateui">
                Conta Gestora vê sua carteira consolidada das Contas Gerenciadas vinculadas.
                Conta Gerenciada vê apenas a própria carteira.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Clientes visíveis no contexto selecionado" action="Regra aplicada">
        <DataTable
          rows={visibleClients}
          columns={['id', 'name', 'tier', 'managedAccountName', 'ownerName', 'health']}
          headers={['ID', 'Cliente', 'Categoria', 'Conta', 'Responsável', 'Saúde']}
        />
      </Panel>

      <Panel title="Atividades recentes">
        <ActivityList events={auditEvents.slice(0, 5)} />
      </Panel>
    </div>
  );
}

function ProjectIntro() {
  const items = [
    {
      title: 'Objetivo do projeto',
      text: 'Criar uma base navegável para uma plataforma B2B de onboarding, relacionamento e governança de acessos entre contas.',
    },
    {
      title: 'Problema de negócio',
      text: 'Operações com múltiplas contas precisam controlar vínculos, usuários, carteiras e visibilidade sem depender de processos manuais.',
    },
    {
      title: 'Valor da plataforma',
      text: 'O MVP demonstra autonomia operacional, segregação de acesso, rastreabilidade e uma visão executiva para decisões de governança.',
    },
  ];

  return (
    <section className="rounded-lg border border-line bg-white shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.15fr]">
        <div className="border-b border-line p-6 lg:border-b-0 lg:border-r">
          <p className="mb-2 text-sm font-semibold text-brand">Account Onboarding & Access Governance Platform</p>
          <h2 className="text-2xl font-semibold tracking-normal text-ink">
            Fundação de produto para governança entre contas B2B
          </h2>
          <p className="mt-3 text-sm leading-6 text-slateui">
            Protótipo funcional com dados simulados locais, pensado para apresentar a lógica central do produto:
            contas gestoras administram contas gerenciadas, usuários operam carteiras e eventos relevantes ficam auditáveis.
          </p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-md border border-line bg-cloud p-4">
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slateui">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ['Conta Gestora', Building2],
    ['Conta Gerenciada', ShieldCheck],
    ['Usuários', Users],
    ['Clientes', ClipboardList],
    ['Auditoria', Activity],
  ];

  return (
    <Panel title="Como funciona" action="Fluxo principal">
      <div className="p-5">
        <div className="grid gap-3">
          {steps.map(([label, Icon], index) => (
            <div key={label}>
              <div className="flex items-center gap-3 rounded-md border border-line bg-cloud p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-brand">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-ink">{label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex h-6 items-center pl-5 text-brand" aria-hidden="true">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function AppliedRules() {
  const rules = [
    {
      title: 'Relacionamento N:N',
      text: 'Contas gestoras podem administrar múltiplas contas gerenciadas, e o modelo está preparado para evoluir vínculos complexos.',
      icon: Building2,
    },
    {
      title: 'Visibilidade por vínculo',
      text: 'A carteira exibida muda conforme o contexto selecionado: gestora consolidada ou conta gerenciada isolada.',
      icon: Eye,
    },
    {
      title: 'Menor privilégio',
      text: 'Perfis Administrador, Operacional e Consulta simulam níveis de acesso progressivos.',
      icon: KeyRound,
    },
    {
      title: 'Auditoria de eventos',
      text: 'Criações de contas, vínculos, usuários e clientes geram eventos rastreáveis no MVP.',
      icon: Activity,
    },
  ];

  return (
    <Panel title="Regras aplicadas" action="Governança">
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <article key={rule.title} className="rounded-md border border-line bg-cloud p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white text-brand">
                  <Icon size={16} />
                </span>
                {rule.title}
              </div>
              <p className="text-xs leading-5 text-slateui">{rule.text}</p>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function CrudPage({ form, summary, tableTitle, rows, columns, headers }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map(([label, value]) => (
          <SummaryTile key={label} label={label} value={value} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        {form}
        <Panel title={tableTitle} action="Dados locais">
          <DataTable rows={rows} columns={columns} headers={headers} />
        </Panel>
      </div>
    </div>
  );
}

function ReadOnlyPage({ rows, columns, headers }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryTile label="Registros" value={rows.length} />
        <SummaryTile label="Origem" value="Local" />
        <SummaryTile label="Status" value="MVP" />
      </div>
      <Panel title="Lista operacional" action="Somente leitura">
        <DataTable rows={rows} columns={columns} headers={headers} />
      </Panel>
    </div>
  );
}

function ManagerForm({ onSubmit }) {
  const [values, setValues] = useState({ name: '', segment: '' });

  return (
    <FormPanel
      title="Criar Conta Gestora"
      onSubmit={() => {
        onSubmit(values);
        setValues({ name: '', segment: '' });
      }}
      disabled={!values.name || !values.segment}
    >
      <TextField label="Nome" value={values.name} onChange={(name) => setValues({ ...values, name })} />
      <TextField
        label="Segmento"
        value={values.segment}
        onChange={(segment) => setValues({ ...values, segment })}
      />
    </FormPanel>
  );
}

function ManagedForm({ managers, onSubmit }) {
  const [values, setValues] = useState({
    name: '',
    managerId: managers[0]?.id || '',
    owner: '',
    risk: 'Baixo',
  });

  return (
    <FormPanel
      title="Criar Conta Gerenciada"
      onSubmit={() => {
        onSubmit(values);
        setValues({ name: '', managerId: managers[0]?.id || '', owner: '', risk: 'Baixo' });
      }}
      disabled={!values.name || !values.managerId || !values.owner}
    >
      <TextField label="Nome" value={values.name} onChange={(name) => setValues({ ...values, name })} />
      <SelectField
        label="Conta Gestora"
        value={values.managerId}
        onChange={(managerId) => setValues({ ...values, managerId })}
        options={managers.map((item) => [item.id, item.name])}
      />
      <TextField
        label="Responsável"
        value={values.owner}
        onChange={(owner) => setValues({ ...values, owner })}
      />
      <SelectField
        label="Risco"
        value={values.risk}
        onChange={(risk) => setValues({ ...values, risk })}
        options={[
          ['Baixo', 'Baixo'],
          ['Médio', 'Médio'],
          ['Alto', 'Alto'],
        ]}
      />
    </FormPanel>
  );
}

function UserForm({ managedAccounts, onSubmit }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    managedAccountId: managedAccounts[0]?.id || '',
    profile: 'Operacional',
  });

  return (
    <FormPanel
      title="Criar Usuário"
      onSubmit={() => {
        onSubmit(values);
        setValues({
          name: '',
          email: '',
          managedAccountId: managedAccounts[0]?.id || '',
          profile: 'Operacional',
        });
      }}
      disabled={!values.name || !values.email || !values.managedAccountId}
    >
      <TextField label="Nome" value={values.name} onChange={(name) => setValues({ ...values, name })} />
      <TextField
        label="Email"
        value={values.email}
        onChange={(email) => setValues({ ...values, email })}
      />
      <SelectField
        label="Conta Gerenciada"
        value={values.managedAccountId}
        onChange={(managedAccountId) => setValues({ ...values, managedAccountId })}
        options={managedAccounts.map((item) => [item.id, item.name])}
      />
      <SelectField
        label="Perfil"
        value={values.profile}
        onChange={(profile) => setValues({ ...values, profile })}
        options={profileOptions.map((profile) => [profile, profile])}
      />
    </FormPanel>
  );
}

function ClientForm({ users, managedAccounts, onSubmit }) {
  const firstUser = users[0];
  const [values, setValues] = useState({
    name: '',
    tier: 'Corporate',
    ownerUserId: firstUser?.id || '',
    managedAccountId: firstUser?.managedAccountId || managedAccounts[0]?.id || '',
  });

  const responsibleUsers = users.filter((user) => user.managedAccountId === values.managedAccountId);

  function updateManagedAccount(managedAccountId) {
    const nextOwner = users.find((user) => user.managedAccountId === managedAccountId)?.id || '';
    setValues({ ...values, managedAccountId, ownerUserId: nextOwner });
  }

  return (
    <FormPanel
      title="Criar Cliente"
      onSubmit={() => {
        onSubmit(values);
        setValues({
          name: '',
          tier: 'Corporate',
          ownerUserId: firstUser?.id || '',
          managedAccountId: firstUser?.managedAccountId || managedAccounts[0]?.id || '',
        });
      }}
      disabled={!values.name || !values.managedAccountId || !values.ownerUserId}
    >
      <TextField label="Nome" value={values.name} onChange={(name) => setValues({ ...values, name })} />
      <SelectField
        label="Categoria"
        value={values.tier}
        onChange={(tier) => setValues({ ...values, tier })}
        options={[
          ['Corporate', 'Corporate'],
          ['Enterprise', 'Enterprise'],
          ['Strategic', 'Strategic'],
        ]}
      />
      <SelectField
        label="Conta Gerenciada"
        value={values.managedAccountId}
        onChange={updateManagedAccount}
        options={managedAccounts.map((item) => [item.id, item.name])}
      />
      <SelectField
        label="Responsável pelo cadastro"
        value={values.ownerUserId}
        onChange={(ownerUserId) => setValues({ ...values, ownerUserId })}
        options={responsibleUsers.map((item) => [item.id, item.name])}
      />
    </FormPanel>
  );
}

function FormPanel({ title, children, onSubmit, disabled }) {
  return (
    <section className="rounded-lg border border-line bg-white shadow-soft">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
      </div>
      <form
        className="space-y-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {children}
        <button
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slateui/40"
          disabled={disabled}
          type="submit"
        >
          <Plus size={17} />
          Criar registro
        </button>
      </form>
    </section>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      <input
        className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition placeholder:text-slateui focus:border-brand"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      <select
        className="h-10 w-full rounded-md border border-line bg-white px-3 text-sm outline-none transition focus:border-brand"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.length === 0 && <option value="">Nenhuma opção disponível</option>}
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-line bg-cloud p-1">
      {options.map(([optionValue, label]) => (
        <button
          key={optionValue}
          className={`h-9 rounded-md text-sm font-semibold transition ${
            value === optionValue ? 'bg-white text-brand shadow-sm' : 'text-slateui hover:text-ink'
          }`}
          onClick={() => onChange(optionValue)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Sidebar({ activePage, isOpen, onClose, onNavigate }) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-ink/35 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-line px-5">
          <div>
            <div className="text-sm font-bold uppercase text-brand">AOG Platform</div>
            <div className="mt-1 text-xs font-medium text-slateui">
              Onboarding & Governance
            </div>
          </div>
          <button
            aria-label="Fechar menu"
            className="rounded-md p-2 text-slateui hover:bg-cloud lg:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.id === activePage;
            return (
              <button
                key={item.id}
                className={`flex h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                  active
                    ? 'bg-brand text-white shadow-soft'
                    : 'text-slateui hover:bg-cloud hover:text-ink'
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={18} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <div className="rounded-md bg-cloud p-4">
            <p className="text-sm font-semibold text-ink">Ambiente MVP</p>
            <p className="mt-1 text-xs leading-5 text-slateui">
              Dados simulados em memória local. Sem backend, autenticação ou APIs.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          aria-label="Abrir menu"
          className="rounded-md p-2 text-slateui hover:bg-cloud lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slateui"
            size={17}
          />
          <input
            className="h-10 w-full rounded-md border border-line bg-cloud pl-10 pr-3 text-sm outline-none transition placeholder:text-slateui focus:border-brand focus:bg-white"
            placeholder="Buscar contas, usuários ou permissões"
          />
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="text-right">
            <p className="text-sm font-semibold">Governance Ops</p>
            <p className="text-xs text-slateui">Workspace</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-teal text-sm font-bold text-white">
            GO
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ label, value, trend, tone }) {
  const toneMap = {
    brand: 'bg-brand/10 text-brand',
    teal: 'bg-teal/10 text-teal',
    amber: 'bg-amber/10 text-amber',
    rose: 'bg-rose/10 text-rose',
  };

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slateui">{label}</p>
        <span className={`rounded-md px-2 py-1 text-xs font-bold ${toneMap[tone]}`}>
          {trend}
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-normal text-ink">{value}</p>
        <BarChart3 className="text-slateui" size={24} />
      </div>
    </article>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slateui">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function Panel({ title, action, children }) {
  return (
    <section className="rounded-lg border border-line bg-white shadow-soft">
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {action && (
          <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-brand hover:bg-brand/10">
            {action}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

function DataTable({ rows, columns, headers }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-line text-left text-sm">
        <thead className="bg-cloud">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-5 py-3 font-semibold text-slateui">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-white">
          {rows.length === 0 && (
            <tr>
              <td className="px-5 py-6 text-sm text-slateui" colSpan={headers.length}>
                <EmptyState />
              </td>
            </tr>
          )}
          {rows.map((row, index) => (
            <tr key={`${row.id || row.name || row.event}-${index}`} className="hover:bg-cloud/70">
              {columns.map((column) => (
                <td key={column} className="whitespace-nowrap px-5 py-4 text-ink">
                  {isBadgeColumn(column) ? <StatusBadge value={row[column]} /> : row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-cloud px-4 py-8 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-md bg-white text-brand">
        <ClipboardList size={19} />
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">Nenhum registro encontrado</p>
      <p className="mt-1 max-w-md text-xs leading-5 text-slateui">
        Quando novos dados simulados forem criados neste módulo, eles aparecerão automaticamente nesta lista.
      </p>
    </div>
  );
}

function ActivityList({ events }) {
  return (
    <div className="divide-y divide-line">
      {events.map((item) => (
        <div key={item.id} className="flex items-center gap-4 px-5 py-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
            <Activity size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{item.event}</p>
            <p className="mt-1 truncate text-xs text-slateui">
              {item.actor} em {item.target}
            </p>
          </div>
          <span className="whitespace-nowrap text-xs font-medium text-slateui">{item.time}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ value }) {
  const normalized = String(value).toLowerCase();
  const className =
    normalized.includes('alto') || normalized.includes('restrita') || normalized.includes('pendente')
      ? 'bg-rose/10 text-rose'
      : normalized.includes('medio') ||
          normalized.includes('médio') ||
          normalized.includes('revisao') ||
          normalized.includes('revisão') ||
          normalized.includes('acompanhar')
        ? 'bg-amber/10 text-amber'
        : 'bg-teal/10 text-teal';

  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${className}`}>{value}</span>;
}

function isBadgeColumn(column) {
  return ['status', 'risk', 'health'].includes(column);
}

function buildRows({ managerAccounts, managedAccounts, users, clients, auditEvents, lookups }) {
  const clientsByManaged = clients.reduce((acc, client) => {
    acc[client.managedAccountId] = (acc[client.managedAccountId] || 0) + 1;
    return acc;
  }, {});

  const managerRows = managerAccounts.map((manager) => {
    const linkedManaged = managedAccounts.filter((account) => account.managerId === manager.id);
    const clientCount = linkedManaged.reduce(
      (total, account) => total + (clientsByManaged[account.id] || 0),
      0,
    );

    return {
      ...manager,
      managedCount: linkedManaged.length,
      clientCount,
    };
  });

  const managedRows = managedAccounts.map((account) => ({
    ...account,
    managerName: lookups.managers[account.managerId]?.name || 'Sem vínculo',
  }));

  const userRows = users.map((user) => ({
    ...user,
    managedAccountName: lookups.managed[user.managedAccountId]?.name || 'Sem conta',
  }));

  const clientRows = clients.map((client) => ({
    ...client,
    managedAccountName: lookups.managed[client.managedAccountId]?.name || 'Sem conta',
    ownerName: lookups.users[client.ownerUserId]?.name || 'Sem responsável',
  }));

  return {
    managerAccounts: managerRows,
    managedAccounts: managedRows,
    users: userRows,
    clients: clientRows,
    auditEvents,
  };
}

function nextId(prefix, value) {
  return `${prefix}-${String(value).padStart(4, '0')}`;
}

export default App;
