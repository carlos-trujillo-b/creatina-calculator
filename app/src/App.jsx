import { useState } from "react";
import styles from "./App.module.css";

function App() {
  const [prediccion, setPrediccion] = useState(null);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({
    edad: 68,
    peso: 66.5,
    sexo: 1, // 0: Hombre, 1: Mujer
    creatinina_plasma: 3.9,
  });

  // Función para hacer la predicción
  const hacerPrediccion = () => {
    const { edad, peso, sexo, creatinina_plasma } = inputs;

    // Validar los inputs
    if (edad < 0 || peso < 0 || creatinina_plasma < 0) {
      setError("Los inputs no pueden ser negativos");
      return;
    }

    if (edad > 120) {
      setError("La edad no puede ser mayor a 120");
      return;
    }

    if (peso > 300) {
      setError("La fórmula no se ajusta a pesos mayores a 300kg");
      return;
    }

    setError(null);

    // Calcular la predicción: y = intercepto + coef1*x1 + coef2*x2 + ...
    const prediccion =
      (-0.0141 * Math.pow(edad, 2) + 1.1469 * edad + 63.608) * 0.08284024 +
      10.892 * Math.pow(peso, 0.4409) * 0.04675999 +
      (91.888 * sexo - 5.1365) * 0.03997691 +
      (-49.62 * Math.log(creatinina_plasma) + 84.02) * 0.83042286;

    if (prediccion < 0) {
      setError("El cálculo de la Creatina no puede ser negativa");
      return;
    }
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
      <h1>
        Estimación del aclaramiento de creatinina <br />
        FOTC.HEG
      </h1>
      <div className={styles.inputGroup}>
        <label>Edad:</label>
        <input
          type="number"
          name="edad"
          value={inputs.edad}
          required
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
          <option value={1}>Hombre</option>
          <option value={0.87}>Mujer</option>
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
      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.button} onClick={hacerPrediccion}>
        Calcular
      </button>
      {prediccion !== null && (
        <div className={styles.prediccion}>
          <h2>Aclaramiento calculado de Creatinina: {prediccion}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
