export const initialManagerAccounts = [
  {
    id: 'GA-1001',
    name: 'Atlas Gestão',
    segment: 'Serviços financeiros',
    status: 'Ativa',
  },
  {
    id: 'GA-1002',
    name: 'BridgeOps',
    segment: 'Operações B2B',
    status: 'Ativa',
  },
  {
    id: 'GA-1003',
    name: 'NovaTrust',
    segment: 'Governança',
    status: 'Revisão',
  },
];

export const initialManagedAccounts = [
  {
    id: 'MA-2001',
    name: 'Northstar Payments',
    managerId: 'GA-1001',
    owner: 'Marina Costa',
    status: 'Ativa',
    risk: 'Baixo',
  },
  {
    id: 'MA-2002',
    name: 'Lume Capital',
    managerId: 'GA-1002',
    owner: 'Renato Lima',
    status: 'Onboarding',
    risk: 'Médio',
  },
  {
    id: 'MA-2003',
    name: 'Helio Retail',
    managerId: 'GA-1001',
    owner: 'Paula Nunes',
    status: 'Revisão',
    risk: 'Alto',
  },
  {
    id: 'MA-2004',
    name: 'Vertice Labs',
    managerId: 'GA-1003',
    owner: 'Bianca Rocha',
    status: 'Ativa',
    risk: 'Baixo',
  },
];

export const initialUsers = [
  {
    id: 'US-3001',
    name: 'Marina Costa',
    email: 'marina.costa@atlas.example',
    managedAccountId: 'MA-2001',
    profile: 'Administrador',
    status: 'Ativo',
  },
  {
    id: 'US-3002',
    name: 'Renato Lima',
    email: 'renato.lima@bridgeops.example',
    managedAccountId: 'MA-2002',
    profile: 'Operacional',
    status: 'Ativo',
  },
  {
    id: 'US-3003',
    name: 'Paula Nunes',
    email: 'paula.nunes@helio.example',
    managedAccountId: 'MA-2003',
    profile: 'Consulta',
    status: 'Pendente',
  },
];

export const initialClients = [
  {
    id: 'CL-4001',
    name: 'Acme Enterprise',
    tier: 'Enterprise',
    managedAccountId: 'MA-2001',
    ownerUserId: 'US-3001',
    health: 'Saudável',
  },
  {
    id: 'CL-4002',
    name: 'Orion Group',
    tier: 'Corporate',
    managedAccountId: 'MA-2002',
    ownerUserId: 'US-3002',
    health: 'Acompanhar',
  },
  {
    id: 'CL-4003',
    name: 'Lumina Holdings',
    tier: 'Enterprise',
    managedAccountId: 'MA-2003',
    ownerUserId: 'US-3003',
    health: 'Saudável',
  },
];

export const initialAuditEvents = [
  {
    id: 'EV-5001',
    event: 'Conta gerenciada criada',
    actor: 'Sistema MVP',
    target: 'Northstar Payments',
    time: 'Hoje, 09:42',
  },
  {
    id: 'EV-5002',
    event: 'Vínculo criado',
    actor: 'Sistema MVP',
    target: 'Northstar Payments -> Atlas Gestão',
    time: 'Hoje, 09:43',
  },
  {
    id: 'EV-5003',
    event: 'Usuário criado',
    actor: 'Sistema MVP',
    target: 'Marina Costa',
    time: 'Hoje, 10:05',
  },
  {
    id: 'EV-5004',
    event: 'Cliente criado',
    actor: 'Sistema MVP',
    target: 'Acme Enterprise',
    time: 'Hoje, 10:22',
  },
];

export const profiles = [
  {
    name: 'Administrador',
    scope: 'Gestão completa',
    permissions: 'Criar, editar, vincular e consultar',
  },
  {
    name: 'Operacional',
    scope: 'Operação diária',
    permissions: 'Criar registros e consultar carteira',
  },
  {
    name: 'Consulta',
    scope: 'Somente leitura',
    permissions: 'Visualizar dados permitidos',
  },
];

export const permissions = [
  {
    module: 'Contas Gestoras',
    action: 'Criar e listar contas gestoras',
    profile: 'Administrador',
    status: 'Ativa',
  },
  {
    module: 'Contas Gerenciadas',
    action: 'Criar conta e vincular a gestora',
    profile: 'Administrador',
    status: 'Ativa',
  },
  {
    module: 'Usuários',
    action: 'Criar usuário associado a conta gerenciada',
    profile: 'Administrador',
    status: 'Ativa',
  },
  {
    module: 'Clientes',
    action: 'Criar cliente e associar responsável',
    profile: 'Operacional',
    status: 'Ativa',
  },
  {
    module: 'Visibilidade',
    action: 'Aplicar carteira por tipo de conta',
    profile: 'Consulta',
    status: 'Ativa',
  },
];
