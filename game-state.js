// ===== 게임 상태 관리 시스템 =====

class GameState {
    constructor() {
        this.currentGame = null;
        this.games = this.loadGames();
        this.autoSaveInterval = 30000; // 30초마다 자동 저장
        this.autoSaveTimer = null;
        this.updateUI();
    }

    // 게임 불러오기
    loadGames() {
        try {
            const saves = localStorage.getItem('arcadias_saves');
            return saves ? JSON.parse(saves) : {};
        } catch (e) {
            console.error('게임 로드 실패:', e);
            return {};
        }
    }

    // 게임 저장
    saveGames() {
        try {
            localStorage.setItem('arcadias_saves', JSON.stringify(this.games));
            this.updateSaveIndicator();
            return true;
        } catch (e) {
            console.error('게임 저장 실패:', e);
            return false;
        }
    }

    // 새 게임 시작
    newGame(name = '') {
        const timestamp = new Date().toISOString();
        const gameId = 'game_' + Date.now();
        
        this.currentGame = {
            id: gameId,
            name: name || `게임 ${Object.keys(this.games).length + 1}`,
            createdAt: timestamp,
            lastSavedAt: timestamp,
            chapters: [{
                id: 1,
                content: '🌟 당신은 아르카디아스의 광활한 세계에 발을 내딛습니다.\n\n고대의 마법이 흐르는 이 땅에서 당신의 이야기를 시작하겠습니다. 무엇을 하고 싶으신가요?',
                createdAt: timestamp
            }],
            conversation: [{
                role: 'system',
                content: 'You are a fantasy storyteller. Create an immersive story experience based on user actions.'
            }],
            stats: {
                actions: 0,
                time: 0
            }
        };

        this.games[gameId] = this.currentGame;
        this.saveGames();
        this.startAutoSave();
        return gameId;
    }

    // 게임 불러오기
    loadGame(gameId) {
        if (this.games[gameId]) {
            this.currentGame = this.games[gameId];
            this.startAutoSave();
            return true;
        }
        return false;
    }

    // 게임 삭제
    deleteGame(gameId) {
        if (this.games[gameId]) {
            delete this.games[gameId];
            this.saveGames();
            if (this.currentGame?.id === gameId) {
                this.currentGame = null;
                this.stopAutoSave();
            }
            return true;
        }
        return false;
    }

    // 현재 게임에 액션 추가
    addAction(action) {
        if (!this.currentGame) return false;

        const chapter = this.currentGame.chapters[this.currentGame.chapters.length - 1];
        if (!chapter.actions) {
            chapter.actions = [];
        }

        chapter.actions.push({
            text: action,
            timestamp: new Date().toISOString()
        });

        this.currentGame.stats.actions++;
        this.currentGame.lastSavedAt = new Date().toISOString();
        
        return true;
    }

    // 새 챕터 추가
    addChapter(content) {
        if (!this.currentGame) return false;

        this.currentGame.chapters.push({
            id: this.currentGame.chapters.length + 1,
            content: content,
            createdAt: new Date().toISOString()
        });

        return true;
    }

    // 대화 히스토리에 추가 (GPT 연동용)
    addToConversation(role, message) {
        if (!this.currentGame) return false;

        this.currentGame.conversation.push({
            role: role,
            content: message
        });

        // 메모리 초과 방지: 최근 20개만 유지
        if (this.currentGame.conversation.length > 20) {
            this.currentGame.conversation = this.currentGame.conversation.slice(-20);
        }

        return true;
    }

    // 자동 저장 시작
    startAutoSave() {
        this.stopAutoSave();
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);
    }

    // 자동 저장
    autoSave() {
        if (this.currentGame) {
            this.currentGame.lastSavedAt = new Date().toISOString();
            this.saveGames();
            this.updateAutoSaveTime();
        }
    }

    // 자동 저장 중지
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // UI 업데이트
    updateUI() {
        this.updateSavesList();
        this.updateGameInfo();
    }

    // 저장본 목록 업데이트
    updateSavesList() {
        const container = document.getElementById('saveListContainer');
        const games = Object.values(this.games);

        if (games.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div>저장된 게임이 없습니다</div>
                </div>
            `;
            return;
        }

        container.innerHTML = games.map(game => `
            <div class="save-item" onclick="loadAndPlay('${game.id}')">
                <div class="save-item-name">📘 ${game.name}</div>
                <div class="save-item-info">
                    <div>챕터: ${game.chapters.length} | 액션: ${game.stats.actions}</div>
                    <div>${new Date(game.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>
        `).join('');
    }

    // 게임 정보 업데이트
    updateGameInfo() {
        if (!this.currentGame) return;

        const chapterInfo = document.getElementById('chapterInfo');
        const autoSaveInfo = document.getElementById('autoSaveInfo');
        const currentGameName = document.querySelector('[id="currentGameName"]');

        if (chapterInfo) {
            chapterInfo.innerHTML = `챕터 ${this.currentGame.chapters.length} / 액션 ${this.currentGame.stats.actions}`;
        }

        if (autoSaveInfo) {
            this.updateAutoSaveTime();
        }
    }

    // 마지막 자동 저장 시간 업데이트
    updateAutoSaveTime() {
        const autoSaveInfo = document.getElementById('autoSaveInfo');
        if (!autoSaveInfo || !this.currentGame) return;

        const lastSaved = new Date(this.currentGame.lastSavedAt);
        const now = new Date();
        const diff = Math.floor((now - lastSaved) / 1000);

        if (diff < 60) {
            autoSaveInfo.innerHTML = '방금 전 ✓';
        } else if (diff < 3600) {
            autoSaveInfo.innerHTML = `${Math.floor(diff / 60)}분 전 ✓`;
        } else {
            autoSaveInfo.innerHTML = `${Math.floor(diff / 3600)}시간 전 ✓`;
        }
    }

    // 저장 표시 업데이트
    updateSaveIndicator() {
        const indicator = document.getElementById('saveIndicator');
        const status = document.getElementById('saveStatus');

        if (indicator) {
            indicator.classList.remove('saving');
            indicator.classList.add('saved');
        }
        if (status) {
            status.textContent = '저장됨';
        }

        setTimeout(() => {
            if (indicator && this.currentGame) {
                indicator.classList.remove('saved');
            }
        }, 2000);
    }

    // 게임 목록 가져오기
    getGamesList() {
        return Object.values(this.games);
    }

    // 현재 게임 가져오기
    getCurrentGame() {
        return this.currentGame;
    }

    // 게임 내보내기
    exportGames() {
        return JSON.stringify(this.games, null, 2);
    }

    // 게임 가져오기
    importGames(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.games = { ...this.games, ...imported };
            this.saveGames();
            this.updateUI();
            return true;
        } catch (e) {
            console.error('게임 가져오기 실패:', e);
            return false;
        }
    }
}

// 글로벌 상태 관리
const gameState = new GameState();

// ===== UI 함수들 =====

function showNewGameModal() {
    document.getElementById('newGameModal').classList.add('active');
    document.getElementById('gameName').focus();
}

function showLoadGameModal() {
    document.getElementById('loadGameModal').classList.add('active');
    gameState.updateSavesList();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function confirmNewGame() {
    const gameName = document.getElementById('gameName').value.trim();
    const gameId = gameState.newGame(gameName || '새 게임');
    closeModal('newGameModal');
    playGame(gameId);
}

function loadAndPlay(gameId) {
    if (gameState.loadGame(gameId)) {
        closeModal('loadGameModal');
        playGame(gameId);
    }
}

function playGame(gameId) {
    const game = gameState.getCurrentGame();
    if (!game) return;

    // UI 업데이트
    document.getElementById('mainButtons').style.display = 'none';
    document.getElementById('inputSection').style.display = 'flex';
    document.getElementById('infoPanels').style.display = 'grid';

    // 스토리 표시
    displayStory(game);
    gameState.updateUI();

    // 입력 포커스
    setTimeout(() => {
        document.getElementById('userInput').focus();
    }, 100);
}

function displayStory(game) {
    const container = document.getElementById('storyContainer');
    const chapters = game.chapters;
    
    let html = '';
    chapters.forEach(chapter => {
        html += `<p>${chapter.content}</p>`;
        if (chapter.actions) {
            chapter.actions.forEach(action => {
                html += `<p style="color: #667eea; font-style: italic;">▶ ${action.text}</p>`;
            });
        }
    });

    container.innerHTML = `<div class="story-text">${html}</div>`;
    container.scrollTop = container.scrollHeight;
}

function sendAction() {
    const input = document.getElementById('userInput');
    const action = input.value.trim();

    if (!action || !gameState.currentGame) return;

    // 사용자 액션 표시
    gameState.addAction(action);
    gameState.addToConversation('user', action);
    displayStory(gameState.currentGame);

    input.value = '';
    input.focus();

    // 로딩 표시
    const status = document.getElementById('saveStatus');
    status.textContent = 'GPTs와 통신 중...';

    // GPTs에 요청
    fetchStoryResponse(action);
}

function fetchStoryResponse(action) {
    const game = gameState.currentGame;
    if (!game) return;

    // gpts-helper.js의 함수 호출
    callGPTsStory(game, action, (response) => {
        if (response) {
            gameState.addChapter(response);
            gameState.addToConversation('assistant', response);
            displayStory(game);
            gameState.saveGames();
        }
        
        document.getElementById('saveStatus').textContent = '준비 완료';
        gameState.updateUI();
    });
}

// 엔터키 지원
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAction();
            }
        });
    }
});