import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminHome = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // GET savollar
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:1111/admin/getquestions");
      setQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE savol
  const handleDelete = async (id) => {
    if (!id) return alert("ID not found!");
    try {
      await axios.delete(`http://localhost:1111/admin/delete/${id}`);
      fetchQuestions();
    } catch (err) {
      console.log("Delete error:", err);
      alert("Xatolik yuz berdi, server javob bermadi!");
    }
  };

  // FULL EDIT (savol + barcha javoblar)
  const handleEditFull = async (question) => {
    const newQuestionBody = prompt("Savol matnini tahrirlash:", question.question_body);
    if (!newQuestionBody) return;

    const updatedOptions = question.options.map((opt) => {
      const newOptionBody = prompt(`Variantni tahrirlash: (${opt.body})`, opt.body);
      const isCorrectInput = prompt(
        `Bu variant to‘g‘ri javobmi? (true/false)`,
        opt.is_correct ? "true" : "false"
      );
      return {
        id: opt.id,
        body: newOptionBody || opt.body,
        is_correct: isCorrectInput === "true"
      };
    });

    try {
      await 
      axios.put(`http://localhost:1111/admin/updatequestion/${id}`, data
        ,

        {
          question_body: newQuestionBody,
          correct_answer: updatedOptions.find(o => o.is_correct)?.body || null,
          options: updatedOptions
        },
        { headers: { "Content-Type": "application/json" } }
      );

      fetchQuestions();
    } catch (err) {
      console.log("Update error:", err);
      alert("Xatolik yuz berdi, server javob bermadi!");
    }
  };

  // Log Out
  const handleLogout = () => {
    navigate("/home");
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <div className="header-buttons">
          <button className="btn add-btn" onClick={() => navigate("/admin/add")}>
            Add Question
          </button>
          <button className="btn logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <div className="questions-list">
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <h3>{q.question_body}</h3>
            <div className="options">
              {q.options?.map((opt) => (
                <div key={opt.id} className={`option ${opt.is_correct ? "correct" : ""}`}>
                  <span>{opt.body}</span>
                </div>
              ))}
            </div>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEditFull(q)}>✏️ Edit All</button>
              <button className="delete-btn" onClick={() => handleDelete(q.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
