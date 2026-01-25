# UI 프로토타입 프롬프트 (v0.dev)

이 문서는 v0.dev에서 사용할 UI 프로토타입 생성 프롬프트를 정리합니다.

## 🎨 디자인 가이드라인

### 전체 테마
- **스타일**: 모던/미니멀, 지하철 느낌
- **색상**: 지하철 노선 공식 색상 사용
- **플랫폼**: 모바일 우선 (React Native 스타일)
- **아이콘**: 라인 스타일, 깔끔한 아이콘

### 노선 색상 (공식)
- 1호선: #0052A4 (파랑)
- 2호선: #00A84D (초록)
- 3호선: #EF7C1C (주황)
- 4호선: #00A5DE (하늘)
- 5호선: #996CAC (보라)
- 6호선: #CD7C2F (갈색)
- 7호선: #747F00 (올리브)
- 8호선: #E6186C (분홍)
- 9호선: #BDB092 (금색)

---

## 📱 화면별 프롬프트

> **프로토타입 스크린샷**: v0.dev에서 생성된 UI 프로토타입 스크린샷은 `prototype/` 디렉토리에 있습니다.

### 화면 1: 홈 화면 (도착 정거장 선택) - 개선됨

![홈 화면 프로토타입](./prototype/Screenshot%202026-01-25%20at%204.13.45%20PM.png)

```
Create a modern, minimal mobile-first React component for a subway route finder app's home screen.

Layout:
- Top section: App title/logo area (compact, minimal)
- Main content area (focus on destination selection):
  - **Destination station selection (PRIMARY, large, prominent)**:
    - Large card/button taking up significant space
    - Icon: map pin or destination marker (large)
    - Text: "도착 정거장 선택" (large, bold when empty)
    - Selected station display: Station name (large) + line indicators
    - Clear visual hierarchy - this is the main action
  - **GPS-based departure station info bar (SECONDARY, compact)**:
    - If GPS enabled + auto-selected:
      - Compact horizontal bar/badge at top
      - Small location icon (📍)
      - Text: "[Station Name]에서 출발" (small to medium)
      - "변경" button (small text button, easily tappable)
      - Subtle background color to distinguish from main content
    - If GPS disabled:
      - Compact button: "출발 정거장 선택" (smaller than destination)
      - Icon: location pin
      - Positioned below destination or as secondary card
- Bottom section (sticky or fixed):
  - "경로 찾기" button (large, prominent)
  - Disabled state: Grayed out, shows "출발역과 도착역을 선택해주세요"
  - Enabled state: Primary color, bold text
  - Button becomes active when both stations selected

Design requirements:
- Modern, minimal subway-themed design
- Clean typography, readable fonts
- Subtle shadows and rounded corners
- Use subway line colors as accent colors (1호선: #0052A4, 2호선: #00A84D, etc.)
- Mobile-first responsive design
- Card-based layout with proper spacing
- GPS status indicator (small icon or badge in top-right corner)
- Clear visual hierarchy: Destination > Departure > Action button
- Touch-friendly: All interactive elements minimum 44px height

States to show:
1. GPS enabled + departure auto-selected: 
   - Compact info bar at top: "[Station Name]에서 출발" + "변경" button
   - Large destination selection card (main focus)
2. GPS disabled: 
   - Smaller "출발 정거장 선택" button (secondary)
   - Large destination selection card (main focus)
3. Destination not selected: 
   - Large "도착 정거장 선택" card (empty state, prominent)
4. Both selected: 
   - Both stations displayed clearly
   - "경로 찾기" button enabled and prominent

Accessibility:
- All buttons have proper aria-labels
- Color contrast meets WCAG AA standards
- Focus states clearly visible
- Screen reader friendly

Error states:
- GPS permission denied: Show "위치 권한이 필요합니다" + "설정으로 이동" button
- Network error: Show "인터넷 연결을 확인해주세요" + "재시도" button
- Same station selected: Show inline error "출발역과 도착역이 같습니다"

Loading states:
- GPS location loading: Show skeleton or spinner in departure area
- Station data loading: Show skeleton cards

Use shadcn/ui components and Tailwind CSS. Make destination selection the clear primary action, with departure as secondary information. Ensure the design is visually appealing, intuitive, and accessible.
```

---

### 화면 2: 출발 정거장 선택 (GPS 기반) - 개선됨

![출발 정거장 선택 프로토타입](./prototype/Screenshot%202026-01-25%20at%204.14.22%20PM.png)

```
Create a modern mobile-first React component for selecting a departure subway station with GPS-based nearby stations display.

Layout:
- Top: Header with back button and "출발 정거장 선택" title
- GPS status indicator (small badge): Shows "위치 서비스 활성" or "위치 서비스 비활성"
- Main content:
  - **GPS-enabled view (Hybrid Layout - Recommended)**:
    - Option A: Card Grid Layout (more practical for mobile):
      - Top: Large prominent card showing the nearest station
        - Station name (large, bold)
        - Distance: "200m" (medium)
        - Walking time: "도보 3분" (small, helpful)
        - Direction indicator: "북쪽" or direction arrow (↑↓←→)
        - Line indicators with official colors
        - Large, prominent, easy to tap
      - Below: Grid of 3-4 smaller cards (2 columns) showing nearby stations
        - Each card: Station name, distance + walking time, direction, line colors
        - Cards arranged in distance order (closest to farthest)
        - Each card progressively smaller or same size but less prominent
      - "더 많은 역 보기" button → Expands to full searchable list
    - Option B: Circular Layout (alternative, if space allows):
      - Center: Large circular button (nearest station)
      - Surrounding: 3-4 smaller circular buttons in radial pattern
      - Each shows: Station name, distance + walking time, direction
      - Ensure touch targets don't overlap (minimum spacing)
  - **GPS-disabled view (consistent with destination selection)**:
    - Search input field at top (large, prominent)
    - Station list below (scrollable)
    - Each station item shows:
      - Station name (Korean + English)
      - Line number and color indicator (official colors)
      - Station number
      - Same card style as destination selection for consistency

Design requirements:
- Modern, clean design with subway theme
- Use actual subway line colors (#0052A4 for line 1, #00A84D for line 2, etc.)
- Clear visual hierarchy (largest/most prominent = nearest)
- Touch-friendly: All buttons/cards minimum 44px height, adequate spacing
- Distance + walking time displayed: "200m (도보 3분)" format
- Direction information: Show compass direction or arrow
- Consistent card style with destination selection screen
- Smooth animations for interactions
- "현재 위치 재확인" button (refresh GPS location)

Visual style:
- Card-based layout (recommended over circular for mobile)
- Rounded corners, subtle shadows
- Color-coded by subway line (official colors)
- Minimal, modern aesthetic
- Clear distance-based visual hierarchy

Accessibility:
- All interactive elements have proper labels
- Color contrast meets WCAG AA
- Touch targets minimum 44px
- Screen reader support

Error states:
- GPS permission denied: "위치 권한이 필요합니다" + "설정으로 이동"
- GPS location unavailable: "위치를 찾을 수 없습니다" + "수동 선택" button
- No nearby stations: Show search interface with helpful message

Loading states:
- GPS location loading: Skeleton cards or spinner
- Station data loading: Skeleton list items

Use shadcn/ui components, Tailwind CSS. Prioritize the card grid layout for better mobile usability. Make it intuitive, accessible, and visually appealing.
```

---

### 화면 3: 도착 정거장 선택 - 개선됨

![도착 정거장 선택 프로토타입](./prototype/Screenshot%202026-01-25%20at%204.14.58%20PM.png)

```
Create a modern mobile-first React component for selecting a destination subway station.

Layout:
- Top: Header with back button and "도착 정거장 선택" title
- **Search section (PRIMARY, most prominent)**:
  - Large search input field at the very top
  - Search icon on the left
  - Clear button (X) appears when text is entered
  - Real-time search results with autocomplete
  - Search results highlighted with background color
  - Placeholder: "역명을 검색하세요" or "Search station name"
- **Recent selections section (shown only when search is empty)**:
  - Horizontal scrollable list
  - Recent 3-5 stations as cards
  - "최근 선택한 역" label
  - Hidden when user starts typing
- **Filter section (collapsible, secondary)**:
  - "필터" button/icon that expands filter options
  - When expanded: Line filter tabs (1호선, 2호선, etc.) with official line colors
  - "전체" tab for showing all lines
  - Can be collapsed to save space
- **Station list (scrollable, main content)**:
  - Each station item as a card/button:
    - Station name (Korean, large, bold)
    - English name (smaller, gray, below Korean name)
    - Line indicators (colored badges/circles with official colors)
    - Station number (small, muted)
    - Transfer stations: Multiple line indicators if applicable
  - Grouped by line or alphabetical (user preference)
  - Highlight selected station with border or background color
  - Empty state when no results: "검색 결과가 없습니다" with helpful message

Design requirements:
- Clean, searchable list interface
- Official subway line colors for line indicators
- Touch-friendly list items (minimum 44px height, comfortable spacing)
- Clear visual hierarchy: Search > Filters > List
- Search results highlighted with subtle background
- Smooth scrolling with proper virtualization for long lists
- Modern card-based design
- Consistent with departure station selection style

Visual style:
- Minimal, subway-themed
- Color-coded line indicators (official colors)
- Rounded corners
- Subtle shadows for depth
- Clean typography
- Search-first design

Accessibility:
- Search input has proper label
- Keyboard navigation support
- Screen reader announcements for search results
- Color contrast meets WCAG AA

Error states:
- No search results: "검색 결과가 없습니다. 다른 검색어를 시도해보세요."
- Network error: "연결 오류" + "재시도" button

Loading states:
- Search in progress: Show loading indicator in search field
- Initial data loading: Skeleton list items

Sorting options (optional, in filter section):
- "거리순" (if GPS available)
- "이름순" (alphabetical)
- "노선순" (by line)

Use shadcn/ui components, Tailwind CSS. Make search the primary interaction method. Ensure fast, intuitive search experience with proper feedback.
```

---

### 화면 4: 경로 결과 화면 - 개선됨

![경로 결과 화면 프로토타입](./prototype/Screenshot%202026-01-25%20at%204.15.05%20PM.png)

```
Create a modern mobile-first React component for displaying multiple optimal subway route options.

Layout:
- Top: Header with back button and route summary
  - From: [Departure Station] → To: [Destination Station]
  - Compact, clear display
- **Sort/Filter bar (below header)**:
  - Sort options: "시간순", "비용순", "환승순" (toggle buttons or dropdown)
  - Filter icon: Opens filter options (환승 없음, 특정 노선 제외 등)
  - View toggle: "리스트" / "비교" view switch
- **GPS Optimal Route Banner (if applicable, sticky at top)**:
  - Large, prominent banner: "📍 현재 위치 기준 최적 경로"
  - Special background color or border to stand out
  - Auto-scrolls to this route when available
- Route options list (scrollable):
  - **List View (default)**:
    - Each route option as a card:
      - **GPS optimal indicator**: Large badge "📍 최적" if location-based
      - Route badge/indicator: "최단 시간", "최소 비용", "최적 경로" (small badge)
      - Visual route preview:
        - Simplified subway line visualization
        - Line colors matching official colors
        - Transfer points marked clearly with transfer icon
      - **Key metrics (prominent, side by side)**:
        - Total time: "약 25분" (large, bold, primary color)
        - Total cost: "1,400원" (large, bold, secondary color - EQUAL SIZE to time)
        - Display time and cost with equal visual weight
      - **Secondary metrics (below, smaller)**:
        - Transfer count: "1회 환승" (medium)
        - Total distance: "12.5km" (medium)
        - Number of stations: "5개 역" (small)
      - Additional info (expandable section):
        - Transfer stations list with line colors
        - Expected congestion level (if available)
        - Optimal exit information (if available)
      - Selection state: 
        - Border highlight (thick, colored) when selected
        - Background color change on selection
  - **Comparison View (alternative)**:
    - Table-like layout with routes as rows
    - Columns: Route preview | Time | Cost | Transfers | Distance
    - Easy side-by-side comparison
    - GPS optimal route highlighted row
- Bottom action bar (sticky):
  - "상세 보기" button (primary, large, when route selected)
  - "다시 검색" button (secondary, smaller)
  - Disabled state: "경로를 선택해주세요"

Design requirements:
- Card-based layout for list view
- Table-based layout for comparison view
- Clear visual hierarchy: Time and Cost are EQUALLY prominent (both large, bold)
- Official subway line colors for route visualization
- GPS-based optimal route VERY clearly marked (banner + badge + highlight)
- Comparison-friendly: Easy to compare time, cost, transfers at a glance
- Touch-friendly cards (minimum 44px height, adequate spacing)
- Smooth scrolling
- Selected state clearly visible (border + background change)

Visual style:
- Modern, minimal subway theme
- Color-coded by subway lines (official colors)
- Clean metrics display with equal emphasis on time and cost
- Intuitive route visualization
- Professional, trustworthy appearance
- GPS optimal route: Special visual treatment (gold/bright color, prominent)

Accessibility:
- All route cards have proper labels
- Sort/filter controls are keyboard accessible
- Screen reader announces route details
- Color contrast meets WCAG AA

Error states:
- No routes found: "경로를 찾을 수 없습니다" + "다른 역으로 시도" suggestion
- Network error: "연결 오류" + "재시도" button
- Same station: "출발역과 도착역이 같습니다" (should be caught earlier, but handle gracefully)

Loading states:
- Route calculation: Large spinner or skeleton cards
- Show "경로를 계산하고 있습니다..." message
- Progress indicator if calculation takes time

Empty states:
- No routes: Helpful message with suggestions
- Filtered out all routes: "필터 조건에 맞는 경로가 없습니다"

Use shadcn/ui components, Tailwind CSS. Make route comparison easy and visually clear. Ensure time and cost are equally prominent. GPS optimal route must be unmistakably clear.
```

---

### 화면 5: 경로 상세 화면 - 개선됨

![경로 상세 화면 프로토타입](./prototype/Screenshot%202026-01-25%20at%204.15.26%20PM.png)

```
Create a modern mobile-first React component for displaying detailed subway route information step-by-step.

Layout:
- Top: Header with back button and "경로 상세" title
  - "다른 경로 보기" button (small, in header) - returns to route results
- **Route summary card (sticky at top, prominent)**:
  - Large display of key metrics:
    - Total time: "약 25분" (very large, bold, primary)
    - Total cost: "1,400원" (very large, bold, secondary - EQUAL SIZE to time)
    - Total distance: "12.5km" (medium)
    - Transfer count: "1회 환승" (medium)
  - GPS indicator if location-based: "📍 현재 위치 기준"
  - Visual route preview (mini version): Simplified line visualization
- **Real-time information section (if available)**:
  - "다음 열차 도착: 2분 후" (live update)
  - "현재 위치: 강남역 → 역삼역 구간" (if GPS active)
  - Congestion level: "보통" with color indicator
- **Route visualization (visual timeline/stepper)**:
  - Vertical timeline showing:
    - Current location (if GPS) → Distance to departure station
    - Departure station (large, bold)
    - Each station in sequence with:
      - Station name
      - Line color indicator (official colors)
      - Distance from previous: "0.8km"
      - Time from previous: "2분"
    - Transfer points (clearly marked):
      - Large transfer icon
      - Transfer station name (bold)
      - Transfer distance: "150m"
      - Transfer time: "3분"
      - Transfer difficulty: "쉬움/보통/어려움" indicator
    - Arrival station (large, bold)
  - Line colors matching official subway colors
  - Visual connection lines between stations
  - Smooth, easy-to-follow progression
- **Optimal exit information (if available)**:
  - "목적지 근처 최적 출구: 2번 출구"
  - Walking distance from exit to destination
- **Detailed segment list (scrollable, expandable)**:
  - Each segment as a card:
    - Segment number/step (small badge)
    - Boarding station (large, bold) with line color
    - Line name with official color badge
    - Route preview: Visual line segment
    - Distance: "0.8km" (medium)
    - Time: "2분" (medium)
    - Alighting station (large, bold)
    - Transfer info (if applicable, expandable):
      - Transfer station name (bold)
      - Transfer distance: "150m"
      - Transfer time: "3분"
      - Transfer difficulty: Icon + text
      - Fastest transfer path indicator
    - Congestion level (if available): "보통" with color
  - Expandable sections for additional details
- Bottom action bar (sticky):
  - "다시 검색" button (primary)
  - "다른 경로 보기" button (secondary)
  - Share button (optional, icon only)

Design requirements:
- Clear step-by-step visualization with visual timeline
- Official subway line colors throughout
- Easy to follow route progression (visual flow)
- Transfer points VERY clearly highlighted (larger, different color, icon)
- Distance and time for each segment clearly displayed
- GPS-based current location prominently shown if applicable
- Real-time information integrated naturally
- Scrollable detailed list with smooth scrolling
- Visual timeline/stepper component with clear progression
- Time and cost equally prominent in summary

Visual style:
- Timeline/stepper design for route visualization (vertical flow)
- Color-coded by subway lines (official colors)
- Clean, readable typography
- Modern, minimal aesthetic
- Professional route display
- Visual hierarchy: Summary > Timeline > Details

Accessibility:
- All segments have proper labels
- Timeline is screen reader friendly
- Color information also conveyed through text/icons
- Keyboard navigation support

Error states:
- Real-time data unavailable: "실시간 정보를 불러올 수 없습니다" (non-blocking)
- Network error: "연결 오류" + "재시도"

Loading states:
- Initial load: Skeleton timeline and cards
- Real-time updates: Subtle loading indicator

Use shadcn/ui components, Tailwind CSS. Make the route easy to follow and understand. Integrate real-time information naturally. Ensure time and cost are equally prominent in summary.
```

---

## 📸 프로토타입 갤러리

모든 화면의 프로토타입 스크린샷:

1. **홈 화면**: [Screenshot 2026-01-25 at 4.13.45 PM.png](./prototype/Screenshot%202026-01-25%20at%204.13.45%20PM.png)
2. **출발 정거장 선택**: [Screenshot 2026-01-25 at 4.14.22 PM.png](./prototype/Screenshot%202026-01-25%20at%204.14.22%20PM.png)
3. **도착 정거장 선택**: [Screenshot 2026-01-25 at 4.14.58 PM.png](./prototype/Screenshot%202026-01-25%20at%204.14.58%20PM.png)
4. **경로 결과 화면**: [Screenshot 2026-01-25 at 4.15.05 PM.png](./prototype/Screenshot%202026-01-25%20at%204.15.05%20PM.png)
5. **경로 상세 화면**: [Screenshot 2026-01-25 at 4.15.26 PM.png](./prototype/Screenshot%202026-01-25%20at%204.15.26%20PM.png)
6. **추가 화면/변형**: [Screenshot 2026-01-25 at 4.16.12 PM.png](./prototype/Screenshot%202026-01-25%20at%204.16.12%20PM.png)

---

## ✅ 개선 사항 반영 완료

### 주요 개선 내용
1. **홈 화면**: 도착 정거장 선택을 메인으로 강조, GPS 출발지를 컴팩트한 정보 바로 변경
2. **출발 정거장 선택**: 원형 레이아웃 대안 제시 (카드 그리드), 도보 시간 및 방향 정보 추가
3. **도착 정거장 선택**: 검색 우선순위 강조, 필터를 접을 수 있는 섹션으로 변경
4. **경로 결과**: 비교 뷰 옵션, GPS 최적 경로 강조, 비용 정보 시각적 강조
5. **경로 상세**: 실시간 정보 통합, 대체 경로 접근 추가
6. **전반적**: 로딩/에러/빈 상태 처리, 접근성 고려사항 추가

---

## 💡 추가 개선 제안 및 보완 사항

### 1. 홈 화면 개선 제안
- **GPS 상태 표시**: GPS 활성화/비활성화 상태를 명확히 표시
- **최근 검색**: 최근 검색한 경로 2-3개를 빠른 액세스로 제공
- **즐겨찾는 역**: 자주 가는 역을 즐겨찾기로 저장 가능
- **빠른 선택**: 인기 역 또는 근처 역 빠른 선택 버튼

### 2. 출발 정거장 선택 개선 제안
- **지도 뷰 옵션**: 원형 버튼 외에 미니맵 형태로도 표시 가능
- **거리 표시**: 각 역까지의 도보 시간도 함께 표시 (예: "200m (3분)")
- **방향 표시**: 각 역의 방향(동서남북) 표시로 직관성 향상
- **새로고침**: GPS 위치 재확인 버튼

### 3. 도착 정거장 선택 개선 제안
- **자동완성**: 검색어 입력 시 실시간 자동완성
- **음성 검색**: 음성으로 역명 입력 가능 (선택)
- **역 그룹핑**: 환승역은 여러 노선 아이콘으로 표시
- **거리순 정렬**: GPS 기반 거리순 정렬 옵션

### 4. 경로 결과 화면 개선 제안
- **정렬 옵션**: 시간순, 비용순, 환승순 정렬
- **필터**: 환승 없음, 특정 노선 제외 등 필터링
- **비교 모드**: 여러 경로를 나란히 비교하는 뷰
- **예상 혼잡도**: 각 경로의 예상 혼잡도 표시 (채택된 기능)
- **출구 정보**: 목적지 근처 최적 출구 추천 (채택된 기능)

### 5. 경로 상세 화면 개선 제안
- **노선도 시각화**: 실제 노선도 형태의 시각적 표현
- **실시간 정보**: 실시간 열차 도착 정보 표시 (채택된 기능)
- **대체 경로**: 현재 경로의 대체 옵션 제시
- **공유 기능**: 경로를 이미지나 링크로 공유

### 6. 전반적 UX 개선
- **로딩 상태**: API 호출 시 로딩 인디케이터
- **에러 처리**: 네트워크 오류, GPS 오류 등 명확한 에러 메시지
- **온보딩**: 첫 사용자 가이드 (선택)
- **다크 모드**: 다크 모드 지원 (NativeWind 기본 지원)

---

## 🚀 사용 방법

1. 위의 각 화면별 프롬프트를 v0.dev에 복사하여 붙여넣기
2. 생성된 컴포넌트를 검토하고 필요시 추가 프롬프트로 수정
3. 생성된 코드를 참고하여 실제 React Native 컴포넌트 구현
4. 스크린샷을 찍어 문서에 포함

---

**마지막 업데이트**: 2026-01-25
