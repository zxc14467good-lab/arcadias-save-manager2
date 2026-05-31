// ===== GPTs 연동 헬퍼 =====

const GPT_CONFIG = {
    // ChatGPT Plus 사용자는 웹 페이지에서 수동으로 GPTs 액세스
    // 또는 OpenAI API를 사용하는 경우 여기에 설정
    apiKey: '', // 필요시 설정
    model: 'gpt-4-turbo',
    maxTokens: 500,
    temperature: 0.8
};

// GPTs 응답 시뮬레이션 (실제 API 연동 전)
function callGPTsStory(game, userAction, callback) {
    // 시스템 메시지 + 대화 히스토리 + 사용자 액션
    const systemPrompt = `당신은 판타지 소설 게임 '아르카디아스'의 이야기꾼입니다.

[세계관 정보]
- 게임명: 아르카디아스
- 현재 챕터: ${game.chapters.length}
- 지금까지의 행동 수: ${game.stats.actions}

[최근 스토리]
${game.chapters.slice(-3).map(c => c.content).join('\n\n')}

[지시사항]
1. 사용자의 액션에 기반한 이야기 계속하기
2. 판타지 세계의 생생한 묘사와 상황 전개
3. 사용자의 선택이 스토리에 영향을 미치도록 함
4. 각 응답은 2-4문단 정도의 길이
5. 한국어로 작성

사용자 액션: "${userAction}"

이 액션에 대해 흥미로운 이야기 전개를 만들어주세요.`;

    // 실제 GPTs/API 연동 코드
    if (GPT_CONFIG.apiKey) {
        // OpenAI API 사용
        callOpenAIAPI(systemPrompt, game.conversation, callback);
    } else {
        // 더미 응답 (개발/테스트용)
        setTimeout(() => {
            const dummyResponse = generateDummyResponse(userAction);
            callback(dummyResponse);
        }, 800);
    }
}

// OpenAI API 호출
function callOpenAIAPI(systemPrompt, conversationHistory, callback) {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(1) // system 메시지 제외
    ];

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GPT_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: GPT_CONFIG.model,
            messages: messages,
            max_tokens: GPT_CONFIG.maxTokens,
            temperature: GPT_CONFIG.temperature
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices[0]) {
            const response = data.choices[0].message.content;
            callback(response);
        } else {
            callback('이야기 생성에 실패했습니다. 다시 시도해주세요.');
        }
    })
    .catch(error => {
        console.error('API 오류:', error);
        callback('연결 오류가 발생했습니다. 인터넷을 확인하세요.');
    });
}

// 더미 응답 생성 (개발용)
function generateDummyResponse(action) {
    const responses = [
        `당신이 ${action}을 시작하자, 마법의 바람이 당신을 감쌉니다. 주변의 공기가 반짝이며, 새로운 가능성의 문이 열리는 것을 느낍니다.`,
        `${action}... 당신의 결정은 이 세계의 운명을 바꾸기 시작합니다. 먼 곳에서 무언가 강력한 것이 당신을 향해 다가오고 있습니다.`,
        `당신은 용감하게 ${action}을 시도합니다. 그 순간, 예상치 못한 일이 벌어집니다. 당신 앞에 신비로운 광경이 펼쳐집니다.`,
        `${action}... 이것은 현명한 결정이었나요? 당신은 새로운 세계로 한 발 더 나아갑니다. 무언가 흥미로운 일이 일어나려고 합니다.`,
        `당신의 행동이 파장을 일으킵니다. ${action}을 통해, 당신은 이 세계의 깊은 비밀에 한 발 더 가까워집니다.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

// API 키 설정 (필요시)
function setGPTApiKey(key) {
    GPT_CONFIG.apiKey = key;
}

// 현재 설정 확인
function getGPTConfig() {
    return GPT_CONFIG;
}

// 설정 업데이트
function updateGPTConfig(newConfig) {
    Object.assign(GPT_CONFIG, newConfig);
}