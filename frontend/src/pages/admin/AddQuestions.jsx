import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddQuestion = () => {
  const [body, setBody] = useState("");
  const [options, setOptions] = useState([
    { label: "A", body: "", is_correct: false },
    { label: "B", body: "", is_correct: false },
    { label: "C", body: "", is_correct: false },
    { label: "D", body: "", is_correct: false },
  ]);
  const navigate = useNavigate();

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      is_correct: i === index, // faqat bittasini true qilamiz
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!body.trim() || options.some(opt => !opt.body.trim())) {
      alert("Savol va barcha variantlarni to‘ldiring!");
      return;
    }

    try {
      await axios.post("http://localhost:1111/admin/questions", {
        body,
        admin_id: 1, // admin id ni sessiyadan yoki localStoragedan olish kerak
        options
      });

      // AdminHome sahifasiga o'tish
      navigate("/AdminHome");
    } catch (err) {
      console.error("Add error:", err);
      alert("Savol qo‘shishda xatolik!");
    }
  };

  return (
    <div>
      <h2>Yangi Savol Qo‘shish</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Savol matni"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        {options.map((opt, index) => (
          <div key={index}>
            <label>{opt.label}:</label>
            <input
              type="text"
              placeholder={`${opt.label} variant matni`}
              value={opt.body}
              onChange={(e) => handleOptionChange(index, "body", e.target.value)}
            />
            <input
              type="radio"
              name="correct"
              checked={opt.is_correct}
              onChange={() => handleCorrectChange(index)}
            /> To‘g‘ri javob
          </div>
        ))}

        <button type="submit">Qo‘shish</button>
      </form>
    </div>
  );
};

export default AddQuestion;
