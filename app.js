// Dados da aplicação
const appData = {
  nfts_do_dia: [
    {
      id: 1,
      nome: "Guerreiro Tupi #001",
      imagem: "https://via.placeholder.com/400x400/228B22/FFFFFF?text=Guerreiro+Tupi",
      raridade: "Lendário",
      preco: "0.05 ETH",
      descricao: "NFT gerado por IA representando um guerreiro da tradição Tupi-Guarani"
    },
    {
      id: 2,
      nome: "Pajé Guarani #002", 
      imagem: "https://via.placeholder.com/400x400/8B4513/FFFFFF?text=Paje+Guarani",
      raridade: "Épico",
      preco: "0.03 ETH",
      descricao: "Representação artística de um pajé da cultura Guarani"
    },
    {
      id: 3,
      nome: "Curumim Tupi #003",
      imagem: "https://via.placeholder.com/400x400/DAA520/FFFFFF?text=Curumim+Tupi",
      raridade: "Raro",
      preco: "0.02 ETH",
      descricao: "Jovem guerreiro Tupi em formação"
    }
  ],
  airdrops_ativos: [
    {
      id: 1,
      nome: "Airdrop da Lua Cheia",
      descricao: "Distribua tokens para holders de NFTs durante a lua cheia",
      recompensa: "50 TUPI tokens",
      requisitos: ["Possuir NFT Tupi-Guarani", "Seguir no Twitter", "Entrar no Discord"],
      tempo_restante: "2d 14h 30m"
    },
    {
      id: 2,
      nome: "Airdrop dos Ancestrais", 
      descricao: "Recompensa para membros antigos da comunidade",
      recompensa: "100 TUPI tokens + NFT exclusivo",
      requisitos: ["Ser membro há 30+ dias", "Participar de 5+ eventos"],
      tempo_restante: "5d 8h 15m"
    }
  ],
  marketplace_nfts: [
    {
      id: 1,
      nome: "Tuxaua Tupi",
      imagem: "https://via.placeholder.com/300x300/FF4500/FFFFFF?text=Tuxaua",
      preco: "0.08 ETH",
      raridade: "Lendário"
    },
    {
      id: 2,
      nome: "Cunhã Poranga",
      imagem: "https://via.placeholder.com/300x300/9932CC/FFFFFF?text=Cunha",
      preco: "0.04 ETH",
      raridade: "Épico"
    },
    {
      id: 3,
      nome: "Uirapuru Sagrado",
      imagem: "https://via.placeholder.com/300x300/32CD32/FFFFFF?text=Uirapuru",
      preco: "0.06 ETH",
      raridade: "Místico"
    },
    {
      id: 4,
      nome: "Caipora Protetor",
      imagem: "https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Caipora",
      preco: "0.03 ETH",
      raridade: "Raro"
    }
  ],
  one_stupid_button: {
    valor_atual: 8,
    proximo_valor: 16,
    recompensa_acumulada: "127 TUPI tokens",
    historico: [
      {usuario: "0x1234...5678", valor_pago: 1, timestamp: "2025-09-08 18:30"},
      {usuario: "0x2345...6789", valor_pago: 2, timestamp: "2025-09-08 18:45"},
      {usuario: "0x3456...7890", valor_pago: 4, timestamp: "2025-09-08 19:12"},
      {usuario: "0x4567...8901", valor_pago: 8, timestamp: "2025-09-08 19:30"}
    ]
  },
  estatisticas_comunidade: {
    total_membros: 2847,
    nfts_mintados: 1203,
    tokens_distribuidos: "45,230 TUPI",
    airdrops_realizados: 12
  }
};

// Estado da aplicação
let appState = {
  walletConnected: false,
  currentFilter: 'all',
  userAddress: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupModals();
  renderAirdrops();
  renderDailyNFT();
  renderPreviousNFTs();
  renderMarketplace();
  setupMarketplaceFilters();
  renderOneStupidButton();
  renderButtonHistory();
  startTimers();
  setupWalletConnection();
  setupInteractiveElements();
}

// Navegação corrigida
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remover classe active de todos os links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Adicionar classe active ao link clicado
      link.classList.add('active');
      
      // Fazer scroll suave para a seção
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll spy para atualizar nav ativo
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom > 150) {
      currentSection = section.id;
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Modais corrigidos
function setupModals() {
  const modals = document.querySelectorAll('.modal');
  
  modals.forEach(modal => {
    const backdrop = modal.querySelector('.modal__backdrop');
    const closeBtn = modal.querySelector('.modal__close');
    
    if (backdrop) {
      backdrop.addEventListener('click', () => closeModal(modal));
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  // Setup do modal de carteira
  const walletModal = document.getElementById('wallet-modal');
  if (walletModal) {
    const walletOptions = walletModal.querySelectorAll('.wallet-option');
    walletOptions.forEach(option => {
      option.addEventListener('click', () => {
        const walletName = option.textContent.trim();
        connectWallet(walletName);
        closeModal(walletModal);
      });
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Renderização de Airdrops
function renderAirdrops() {
  const container = document.getElementById('airdrops-grid');
  if (!container) return;
  
  const airdropsHTML = appData.airdrops_ativos.map(airdrop => `
    <div class="airdrop-card">
      <h3 class="airdrop-card__title">${airdrop.nome}</h3>
      <div class="airdrop-card__reward">${airdrop.recompensa}</div>
      <p>${airdrop.descricao}</p>
      <div class="airdrop-card__requirements">
        <strong>Requisitos:</strong>
        <ul>
          ${airdrop.requisitos.map(req => `<li>• ${req}</li>`).join('')}
        </ul>
      </div>
      <div class="airdrop-card__timer">⏰ ${airdrop.tempo_restante}</div>
      <button class="btn btn--primary btn--full-width" onclick="participateAirdrop(${airdrop.id})">
        Participar do Airdrop
      </button>
    </div>
  `).join('');
  
  container.innerHTML = airdropsHTML;
}

function participateAirdrop(id) {
  if (!appState.walletConnected) {
    showNotification('Conecte sua carteira primeiro!', 'warning');
    openModal('wallet-modal');
    return;
  }
  
  showNotification(`Participação no airdrop registrada! 🎉`, 'success');
}

// Renderização do NFT do dia
function renderDailyNFT() {
  const container = document.getElementById('daily-nft');
  if (!container) return;
  
  const nft = appData.nfts_do_dia[0]; // NFT do dia atual
  
  const nftHTML = `
    <img src="${nft.imagem}" alt="${nft.nome}" class="nft-card__image">
    <div class="nft-card__content">
      <h3 class="nft-card__name">${nft.nome}</h3>
      <span class="nft-card__rarity rarity-${nft.raridade.toLowerCase()}">${nft.raridade}</span>
      <div class="nft-card__price">${nft.preco}</div>
      <p class="nft-card__description">${nft.descricao}</p>
      <button class="btn btn--primary btn--full-width" onclick="mintDailyNFT()">
        Mintar NFT do Dia
      </button>
    </div>
  `;
  
  container.innerHTML = nftHTML;
}

function renderPreviousNFTs() {
  const container = document.getElementById('previous-nfts');
  if (!container) return;
  
  const previousNFTs = appData.nfts_do_dia.slice(1); // NFTs anteriores
  
  const nftsHTML = previousNFTs.map(nft => `
    <div class="nft-card">
      <img src="${nft.imagem}" alt="${nft.nome}" class="nft-card__image">
      <div class="nft-card__content">
        <h4 class="nft-card__name">${nft.nome}</h4>
        <span class="nft-card__rarity rarity-${nft.raridade.toLowerCase()}">${nft.raridade}</span>
        <div class="nft-card__price">${nft.preco}</div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = nftsHTML;
}

function mintDailyNFT() {
  if (!appState.walletConnected) {
    showNotification('Conecte sua carteira primeiro!', 'warning');
    openModal('wallet-modal');
    return;
  }
  
  showNotification('NFT mintado com sucesso! 🎨', 'success');
}

// Marketplace corrigido
function renderMarketplace() {
  const container = document.getElementById('marketplace-grid');
  if (!container) return;
  
  renderNFTs(appData.marketplace_nfts, container);
}

function renderNFTs(nfts, container) {
  const nftsHTML = nfts.map(nft => `
    <div class="nft-card" data-rarity="${nft.raridade}">
      <img src="${nft.imagem}" alt="${nft.nome}" class="nft-card__image">
      <div class="nft-card__content">
        <h4 class="nft-card__name">${nft.nome}</h4>
        <span class="nft-card__rarity rarity-${nft.raridade.toLowerCase()}">${nft.raridade}</span>
        <div class="nft-card__price">${nft.preco}</div>
        <button class="btn btn--primary btn--full-width" onclick="buyNFT(${nft.id})">
          Comprar NFT
        </button>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = nftsHTML;
}

function setupMarketplaceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualizar botões ativos
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filtrar NFTs
      const filter = btn.getAttribute('data-filter');
      appState.currentFilter = filter;
      filterMarketplace(filter);
    });
  });
}

function filterMarketplace(filter) {
  const cards = document.querySelectorAll('#marketplace-grid .nft-card');
  
  cards.forEach(card => {
    const rarity = card.getAttribute('data-rarity');
    
    if (filter === 'all' || rarity === filter) {
      card.style.display = 'block';
      // Animar entrada
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    } else {
      card.style.opacity = '0.3';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
}

function buyNFT(id) {
  if (!appState.walletConnected) {
    showNotification('Conecte sua carteira primeiro!', 'warning');
    openModal('wallet-modal');
    return;
  }
  
  showNotification('Compra realizada com sucesso! 💰', 'success');
}

// One Stupid Button
function renderOneStupidButton() {
  const button = appData.one_stupid_button;
  
  const currentCostEl = document.getElementById('current-cost');
  const nextCostEl = document.getElementById('next-cost');
  const rewardPoolEl = document.getElementById('reward-pool');
  
  if (currentCostEl) currentCostEl.textContent = `${button.valor_atual} TUPI`;
  if (nextCostEl) nextCostEl.textContent = `${button.proximo_valor} TUPI`;
  if (rewardPoolEl) rewardPoolEl.textContent = button.recompensa_acumulada;
  
  const buttonElement = document.getElementById('stupid-button');
  if (buttonElement) {
    const buttonText = buttonElement.querySelector('.button-text');
    if (buttonText) {
      buttonText.textContent = `CLIQUE POR ${button.valor_atual} TUPI`;
    }
    
    // Remove event listeners existentes
    buttonElement.replaceWith(buttonElement.cloneNode(true));
    const newButton = document.getElementById('stupid-button');
    newButton.addEventListener('click', handleStupidButtonClick);
  }
}

function renderButtonHistory() {
  const container = document.getElementById('button-history');
  if (!container) return;
  
  const history = appData.one_stupid_button.historico;
  
  const historyHTML = history.map(entry => `
    <div class="history-item">
      <div>
        <div class="history-item__user">${entry.usuario}</div>
        <div class="history-item__time">${entry.timestamp}</div>
      </div>
      <div class="history-item__amount">${entry.valor_pago} TUPI</div>
    </div>
  `).join('');
  
  container.innerHTML = historyHTML;
}

function handleStupidButtonClick() {
  if (!appState.walletConnected) {
    showNotification('Conecte sua carteira primeiro!', 'warning');
    openModal('wallet-modal');
    return;
  }
  
  const currentCost = appData.one_stupid_button.valor_atual;
  
  // Simular clique
  const newEntry = {
    usuario: appState.userAddress || '0x' + Math.random().toString(16).substr(2, 8) + '...',
    valor_pago: currentCost,
    timestamp: new Date().toLocaleString('pt-BR')
  };
  
  // Atualizar dados
  appData.one_stupid_button.historico.push(newEntry);
  appData.one_stupid_button.valor_atual = appData.one_stupid_button.proximo_valor;
  appData.one_stupid_button.proximo_valor *= 2;
  
  // Calcular nova recompensa
  const totalPaid = appData.one_stupid_button.historico.reduce((sum, entry) => sum + entry.valor_pago, 0);
  appData.one_stupid_button.recompensa_acumulada = `${totalPaid} TUPI tokens`;
  
  // Re-renderizar
  renderOneStupidButton();
  renderButtonHistory();
  
  showNotification(`Você clicou o botão! Próximo jogador precisa pagar ${appData.one_stupid_button.valor_atual} TUPI`, 'success');
}

// Timers
function startTimers() {
  // Timer para próximo mint
  let timeLeft = 4 * 3600 + 23 * 60 + 17; // 4h 23m 17s em segundos
  
  const timerInterval = setInterval(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    timeLeft--;
    if (timeLeft < 0) {
      timeLeft = 24 * 3600; // Reset para 24h
      showNotification('Novo NFT foi mintado pela IA! 🎨', 'success');
    }
  }, 1000);
  
  // Animar estatísticas na hero
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat__number');
  
  counters.forEach(counter => {
    const targetText = counter.textContent.replace(',', '');
    const target = parseInt(targetText);
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current).toLocaleString();
      }
    }, 40);
  });
}

// Conexão de carteira corrigida
function setupWalletConnection() {
  const connectBtn = document.getElementById('connect-wallet');
  if (!connectBtn) return;
  
  connectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (appState.walletConnected) {
      disconnectWallet();
    } else {
      openModal('wallet-modal');
    }
  });
}

function connectWallet(walletName) {
  // Simular conexão
  appState.walletConnected = true;
  appState.userAddress = '0x' + Math.random().toString(16).substr(2, 8) + '...';
  
  const connectBtn = document.getElementById('connect-wallet');
  if (connectBtn) {
    connectBtn.textContent = appState.userAddress;
    connectBtn.classList.add('btn--outline');
    connectBtn.classList.remove('btn--primary');
  }
  
  showNotification(`Carteira ${walletName} conectada com sucesso! 🔗`, 'success');
}

function disconnectWallet() {
  appState.walletConnected = false;
  appState.userAddress = null;
  
  const connectBtn = document.getElementById('connect-wallet');
  if (connectBtn) {
    connectBtn.textContent = 'Conectar Carteira';
    connectBtn.classList.remove('btn--outline');
    connectBtn.classList.add('btn--primary');
  }
  
  showNotification('Carteira desconectada', 'info');
}

// Elementos interativos
function setupInteractiveElements() {
  // Botão "Saiba Mais"
  const learnMoreBtn = document.getElementById('learn-more');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      showInfoModal('Sobre o Projeto', `
        <p>O NFT TUPI GUARANI AI é uma iniciativa inovadora que combina inteligência artificial com a preservação cultural indígena brasileira.</p>
        <p><strong>Nossos objetivos:</strong></p>
        <ul>
          <li>Preservar e valorizar a cultura Tupi-Guarani</li>
          <li>Criar arte digital única usando IA</li>
          <li>Construir uma comunidade engajada</li>
          <li>Distribuir valor de forma justa</li>
        </ul>
        <p>Cada NFT criado pela nossa IA é inspirado em elementos reais da cultura ancestral, respeitando tradições e criando pontes entre o passado e o futuro.</p>
      `);
    });
  }
  
  // Botão "Entrar na Comunidade"
  const joinCommunityBtn = document.getElementById('join-community');
  if (joinCommunityBtn) {
    joinCommunityBtn.addEventListener('click', () => {
      if (!appState.walletConnected) {
        showNotification('Conecte sua carteira primeiro!', 'warning');
        openModal('wallet-modal');
        return;
      }
      
      showNotification('Bem-vindo à comunidade Tupi-Guarani! 🏹', 'success');
    });
  }
}

// Funções auxiliares
function showNotification(message, type = 'info') {
  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 2px solid var(--color-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'error' : 'info'});
    border-radius: var(--radius-lg);
    padding: var(--space-16);
    z-index: 3000;
    max-width: 300px;
    box-shadow: var(--shadow-lg);
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: var(--space-8);">
      <span style="font-size: var(--font-size-lg);">
        ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remover após 5 segundos
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

function showInfoModal(title, content) {
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');
  
  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = content;
  
  openModal('info-modal');
}

// Efeitos visuais aprimorados
function addVisualEffects() {
  // Efeito hover nos cards de NFT
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.nft-card')) {
      const card = e.target.closest('.nft-card');
      card.style.transform = 'translateY(-8px)';
      card.style.transition = 'all 0.3s ease';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.nft-card')) {
      const card = e.target.closest('.nft-card');
      card.style.transform = 'translateY(0)';
    }
  });
}

// Smooth scroll para links internos
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Inicialização final
document.addEventListener('DOMContentLoaded', function() {
  addVisualEffects();
  setupSmoothScrolling();
});