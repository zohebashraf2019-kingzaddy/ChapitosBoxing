/* =========================================================
   CHAPITO'S BOXING GYM — MONTHLY SCHEDULE
   ---------------------------------------------------------
   This is the ONLY file you need to edit each month.

   weekly       → the regular week (0 = Sunday … 6 = Saturday)
   closures     → dates with no classes ("YYYY-MM-DD": "reason")
   events       → fight nights, special sessions, etc.
   announcements→ the banner shown for each month ("YYYY-MM")

   type: "boxing" (blue corner) | "women" (red corner) | "event" (brass)
   ========================================================= */
window.GYM_SCHEDULE = {
  weekly: {
    1: [{ time: "4:00 – 8:00 PM", title: "Boxing classes", note: "1-hour sessions. Kids 6+, teens & adults", type: "boxing" }],
    2: [{ time: "4:00 – 8:00 PM", title: "Boxing classes", note: "1-hour sessions. Kids 6+, teens & adults", type: "boxing" }],
    3: [{ time: "4:00 – 8:00 PM", title: "Boxing classes", note: "1-hour sessions. Kids 6+, teens & adults", type: "boxing" }],
    4: [{ time: "4:00 – 8:00 PM", title: "Boxing classes", note: "1-hour sessions. Kids 6+, teens & adults", type: "boxing" }],
    5: [{ time: "6:00 PM", title: "Women's boxing & cardio", note: "All fitness levels. No experience needed", type: "women" }],
    6: [{ time: "8:00 AM", title: "Women's boxing & cardio", note: "All fitness levels. No experience needed", type: "women" }]
  },

  closures: {
    "2026-11-07": "No classes",
    "2026-11-27": "No classes (Thanksgiving weekend)",
    "2026-11-28": "No classes (Thanksgiving weekend)"
  },

  events: {
    // "2026-12-12": [{ time: "1:00 PM", title: "Fight night", note: "Excel Christian School. Come support the team", type: "event" }]
  },

  announcements: {
    "2026-11": {
      title: "November special",
      text: "Our all-women's class is a hit. Fridays at 6 PM and Saturdays at 8 AM. Heads up: no classes Nov 7, 27 & 28."
    }
  }
};
