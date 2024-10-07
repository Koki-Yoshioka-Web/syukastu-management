document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var eventListEl = document.getElementById("eventList");

  // モーダル要素を取得
  var addEventModal = document.getElementById("addEventModal");
  var closeAddEventModal = document.getElementById("closeAddEventModal");
  var saveEventBtn = document.getElementById("saveEventBtn");

  // FullCalendarを初期化
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    selectable: true,
    events: JSON.parse(localStorage.getItem("calendarEvents")) || [],
    dateClick: function (info) {
      // 日付クリック時にモーダルを表示
      addEventModal.style.display = "block";

      // 保存ボタンを押したらイベントを追加
      saveEventBtn.onclick = function () {
        var eventTitle = document.getElementById("eventTitleInput").value;
        var eventTime =
          document.getElementById("eventTimeInput").value || "12:00"; // 時間を取得、デフォルト12:00
        var eventType = document.getElementById("eventTypeInput").value; // イベントタイプを取得

        if (eventTitle) {
          var eventDateTime = info.dateStr + "T" + eventTime;

          var newEvent = {
            title: eventType + ": " + eventTitle, // タイトルにイベントタイプを追加
            start: eventDateTime,
            allDay: false,
          };

          calendar.addEvent(newEvent);

          // ローカルストレージに保存
          var savedEvents =
            JSON.parse(localStorage.getItem("calendarEvents")) || [];
          savedEvents.push(newEvent);
          localStorage.setItem("calendarEvents", JSON.stringify(savedEvents));

          // イベント一覧を更新
          updateEventList(savedEvents);

          // モーダルを閉じる
          addEventModal.style.display = "none";
        }
      };
    },
  });

  calendar.render();

  // モーダルの閉じるボタンがクリックされたらモーダルを閉じる
  closeAddEventModal.onclick = function () {
    addEventModal.style.display = "none";
  };

  // モーダル外をクリックしたら閉じる
  window.onclick = function (event) {
    if (event.target == addEventModal) {
      addEventModal.style.display = "none";
    }
  };

  // イベント一覧を更新する関数
  function updateEventList(events) {
    eventListEl.innerHTML = "";
    events.sort(function (a, b) {
      return new Date(a.start) - new Date(b.start);
    });

    events.forEach(function (event, index) {
      var li = document.createElement("li");
      li.innerHTML = `
          <span>${event.title}</span>
          <span>${new Date(event.start).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })} ${new Date(event.start).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      })}</span>
          <button onclick="deleteEvent(${index})">削除</button>
        `;
      eventListEl.appendChild(li);
    });
  }

  // イベントを削除する関数
  window.deleteEvent = function (index) {
    var savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    savedEvents.splice(index, 1);
    localStorage.setItem("calendarEvents", JSON.stringify(savedEvents));
    calendar.getEvents()[index].remove();
    updateEventList(savedEvents);
  };

  // ページが読み込まれたときにイベント一覧を初期化
  updateEventList(JSON.parse(localStorage.getItem("calendarEvents")) || []);
});
