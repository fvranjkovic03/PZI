import React from "react";

const About = () => {
  return (
    <section id="about" className="py-12 bg-white dark:bg-black dark:text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">O aplikaciji</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Ova aplikacija koristi ChatGPT API za izradu personaliziranih planova putovanja.
          Jednostavno uneseš destinaciju i datume, a sustav ti automatski generira prijedloge
          što vidjeti i raditi. Cilj je olakšati planiranje i pružiti brze, korisne ideje
          za tvoje putovanje.
        </p>
      </div>
    </section>
  );
};

export default About;
