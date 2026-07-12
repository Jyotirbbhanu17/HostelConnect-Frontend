import "../styles/notices.css";

function Notices() {
  const notices = [
    {
      id: 1,
      title: "Water Supply Maintenance",
      author: "1st year Warden - Mr. Sharma",
      date: "05/06/2026",
      description:
        "Water supply will be unavailable from 10 AM to 1 PM due to maintenance work.",
    },
    {
      id: 2,
      title: "Hostel Meeting",
      author: "2nd year Warden - Mr. Girish Soni",
      date: "03/06/2026",
      description:
        "All residents are requested to attend the monthly hostel meeting.",
    },
    {
      id: 3,
      title: "Water Crisis Alert",
      author: "Chief Warden - Mr. Sakle",
      date: "01/06/2026",
      description:
        "Water shortage will be there from next monday onwwards. All be prepared ",
    },
  ];

  return (
    <div className="student-notices-page">
      <div className="notice-grid">
        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <div className="notice-header">
              <h3>{notice.title}</h3>
              <span>{notice.date}</span>
            </div>

            <p className="notice-author">
              👤 {notice.author}
            </p>

            <p>{notice.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notices;
