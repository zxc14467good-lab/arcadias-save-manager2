# ⚔️ 아르카디아스 - 판타지 소설 게임

**모바일 최적화 판타지 소설 게임 플랫폼**

> GPTs의 스토리 기억 부족 문제를 자동 저장 시스템으로 해결한 게임

## 🎮 주요 기능

### 1️⃣ **자동 저장 시스템**
- 30초마다 자동으로 게임 진행 상황 저장
- 로컬 스토리지에 완벽히 보존
- 언제든지 이전 게임 불러오기 가능

### 2️⃣ **GPTs 완벽 연동**
- 대화 히스토리 자동 관리
- 스토리 컨텍스트 유지
- 최근 정보만 GPTs에 전달 (메모리 효율)

### 3️⃣ **모바일 우선 디자인**
- iOS/Android 최적화
- 터치 친화적 인터페이스
- 노치/안전영역 완벽 지원

### 4️⃣ **게임 저장/불러오기**
- 여러 게임 동시 저장
- 언제든지 재개 가능
- 저장본 내보내기/가져오기 지원

## 🚀 시작하기

### 웹 접속
```
https://zxc14467good-lab.github.io/arcadias-save-manager2/
```

### 새 게임 시작
1. "새 게임 시작" 버튼 클릭
2. 게임 이름 입력 (선택사항)
3. "시작하기" 클릭
4. 행동을 입력하여 스토리 진행

## 📖 게임 방식

```
1. 사용자 입력: "마을로 간다"
   ↓
2. 자동 저장: 이전 진행 상황 저장
   ↓
3. GPTs 호출: 스토리 상황 전달
   ↓
4. 스토리 표시: "당신은 마을에 도착했습니다..."
   ↓
5. 자동 저장: 새로운 챕터 저장
```

## 🔧 기술 스택

- **프론트엔드**: HTML5 + CSS3 + Vanilla JavaScript
- **저장소**: LocalStorage + GitHub Pages
- **AI**: OpenAI GPTs / ChatGPT API (선택사항)

## 📱 모바일 최적화

- ✅ 반응형 디자인
- ✅ 터치 최적화
- ✅ 오프라인 저장
- ✅ 자동 저장 알림

## 🛠️ API 연동 (선택사항)

### OpenAI API 사용

`gpts-helper.js`에서 API 키 설정:

```javascript
// gpts-helper.js
const GPT_CONFIG = {
    apiKey: 'sk-your-api-key-here',
    model: 'gpt-4-turbo',
    maxTokens: 500,
    temperature: 0.8
};
```

또는 코드에서:

```javascript
setGPTApiKey('sk-your-api-key-here');
```

## 💾 데이터 구조

### 게임 저장본
```json
{
  "game_1234567890": {
    "id": "game_1234567890",
    "name": "첫 번째 모험",
    "createdAt": "2026-05-31T10:00:00Z",
    "lastSavedAt": "2026-05-31T10:15:30Z",
    "chapters": [
      {
        "id": 1,
        "content": "당신은 아르카디아스에 도착했습니다...",
        "createdAt": "2026-05-31T10:00:00Z",
        "actions": [
          {
            "text": "마을로 간다",
            "timestamp": "2026-05-31T10:01:00Z"
          }
        ]
      }
    ],
    "conversation": [
      {"role": "system", "content": "..."},
      {"role": "user", "content": "마을로 간다"},
      {"role": "assistant", "content": "..."}
    ],
    "stats": {
      "actions": 1,
      "time": 0
    }
  }
}
```

## 🎯 다음 단계

- [ ] OpenAI API 연동
- [ ] 저장본 클라우드 백업
- [ ] 캐릭터 시트 시스템
- [ ] 세계관 자동 생성
- [ ] 멀티플레이어 지원

## 📝 라이선스

MIT License

---

**개발**: zxc14467good-lab
**최종 업데이트**: 2026-05-31