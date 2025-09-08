import React, { useState } from "react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMsg] = useState("");

  function handleSend(e) {
    e.preventDefault();
    alert("Poruka poslana!");
    setName(""); 
    setEmail(""); 
    setMsg("");
  }

  return (
    <section id="contact" className="py-12 bg-white dark:bg-black dark:text-white">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Kontakt</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Imaš pitanje ili prijedlog za AI plan putovanja? Pošalji poruku.
        </p>

        <form onSubmit={handleSend} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Ime"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            placeholder="Poruka"
            rows="4"
            value={message}
            onChange={(e) => setMsg(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full md:w-auto bg-black text-white px-4 py-2 rounded hover:opacity-90"
          >
            Pošalji
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
