import { useState } from "react";
import styles from "./App.module.css";

function App() {
  const [prediccion, setPrediccion] = useState(null);
  const [inputs, setInputs] = useState({
    edad: 60,
    peso: 75,
    sexo: 0, // 0: Hombre, 1: Mujer
    creatinina_plasma: 1.2,
  });

  // Función para hacer la predicción
  const hacerPrediccion = () => {
    const { edad, peso, sexo, creatinina_plasma } = inputs;

    // Calcular la predicción: y = intercepto + coef1*x1 + coef2*x2 + ...
    const prediccion =
      ((0.0017 * edad) ^ (2 - 0.8387 * edad + 105.17)) * 0.1735 +
      ((-0.0031 * peso) ^ (2 + 0.6391 * peso + 43.15)) * 0.0436 +
      (96.094 * sexo - 8.6234) * 0.0436 +
      (-48.99 * Math.log(creatinina_plasma) + 83.97) * 0.7436;
    setPrediccion(prediccion.toFixed(2)); // Redondear a 2 decimales
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value),
    });
  };

  return (
    <div className={styles.App}>
      <h1>Predicción de Creatinina Real</h1>
      <div className={styles.inputGroup}>
        <label>Edad:</label>
        <input
          type="number"
          name="edad"
          value={inputs.edad}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Peso (Kg):</label>
        <input
          type="number"
          name="peso"
          value={inputs.peso}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Sexo:</label>
        <select name="sexo" value={inputs.sexo} onChange={handleInputChange}>
          <option value={0.87}>Hombre</option>
          <option value={1}>Mujer</option>
        </select>
      </div>
      <div className={styles.inputGroup}>
        <label>Creatinina en Plasma:</label>
        <input
          type="number"
          name="creatinina_plasma"
          value={inputs.creatinina_plasma}
          onChange={handleInputChange}
        />
      </div>
      <button className={styles.button} onClick={hacerPrediccion}>
        Predecir
      </button>
      {prediccion !== null && (
        <div className={styles.prediccion}>
          <h2>Predicción: {prediccion}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
