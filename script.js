document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var eventListEl = document.getElementById("eventList");

  // モーダルの要素を取得
  var modal = document.getElementById("eventModal");
  var modalTitle = document.getElementById("eventTitle");
  var modalDate = document.getElementById("eventDate");
  var modalDescription = document.getElementById("eventDescription");
  var closeModal = document.getElementsByClassName("close-btn")[0];

  // ローカルストレージから保存されたイベントを読み込む
  var savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];

  // FullCalendarを初期化
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    selectable: true,
    events: savedEvents,
    eventClick: function (info) {
      // 日付と時間を日本語表記でフォーマットする
      var eventDate = info.event.start.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      });

      var eventTime = info.event.start.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // モーダルを開いてイベントの詳細を表示
      modal.style.display = "block";
      modalTitle.innerText = info.event.title;
      modalDate.innerText = "日付: " + eventDate + " 時間: " + eventTime;
      modalDescription.innerText = info.event.extendedProps.description || "";

      // リンクフォローを防ぐ
      info.jsEvent.preventDefault();
    },
    dateClick: function (info) {
      var eventTitle = prompt("どんな予定？");
      var eventTime = prompt("時間を入力してください（例: 14:30）");

      if (eventTitle && eventTime) {
        var eventDateTime = info.dateStr + "T" + eventTime;

        var newEvent = {
          title: eventTitle,
          start: eventDateTime,
          allDay: false, // All-dayをfalseに設定することで時間を反映
        };

        calendar.addEvent(newEvent);

        // ローカルストレージに保存
        savedEvents.push(newEvent);
        localStorage.setItem("calendarEvents", JSON.stringify(savedEvents));

        // イベント一覧を更新
        updateEventList(savedEvents);
      }
    },
  });

  calendar.render();

  // 閉じるボタンがクリックされたらモーダルを閉じる
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // モーダル外がクリックされたらモーダルを閉じる
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // イベント一覧を更新する関数
  function updateEventList(events) {
    // 既存の一覧をクリア
    eventListEl.innerHTML = "";

    // イベントを日付順にソート
    events.sort(function (a, b) {
      return new Date(a.start) - new Date(b.start);
    });

    // ソートされたイベントを一覧に追加
    events.forEach(function (event, index) {
      if (event.title && event.start) {
        // Check if event has a valid title and start date
        var li = document.createElement("li");

        // Add the event's title and date/time to the list item
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

        // Append the list item to the event list
        eventListEl.appendChild(li);
      }
    });
  }

  // イベントを削除する関数
  window.deleteEvent = function (index) {
    // イベントをローカルストレージから削除
    savedEvents.splice(index, 1);
    localStorage.setItem("calendarEvents", JSON.stringify(savedEvents));

    // カレンダーからイベントを削除
    calendar.getEvents().forEach(function (event, eventIndex) {
      if (eventIndex === index) {
        event.remove();
      }
    });

    // イベント一覧を更新
    updateEventList(savedEvents);
  };

  // ページが読み込まれたときにイベント一覧を初期化
  updateEventList(savedEvents);
});
