import { useState } from "react";
import "./aclaramiento.css";
import { predict } from "../models/RandomForestModel.js";

function Aclaramiento() {
  const [prediccion, setPrediccion] = useState(null);
  const [prediccionMDR4, setPrediccionMDR4] = useState(null);
  const [prediccionCKDEPI, setPrediccionCKDEPI] = useState(null);
  const [prediccionCockro, setPrediccionCockro] = useState(null);
  const [prediccionRandomForest, setPredictionRandomForest] = useState(null);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({
    edad: 68,
    peso: 66.5,
    sexo: 0, // 0: Hombre, 1: Mujer
    creatinina_plasma: 3.9,
    raza: 0, // 0: Blanca, 1: Negra
  });

  const handlePredict = () => {
    const { edad, sexo, creatinina_plasma, peso } = inputs;

    // Llama a la función predict del modelo
    const result = predict([sexo, edad, peso, creatinina_plasma]);
    setPredictionRandomForest(result.toFixed(2));
  };

  const calcularFOTC = () => {
    const { edad, sexo, creatinina_plasma, peso } = inputs;

    const prediccion =
      (-0.0141 * Math.pow(edad, 2) + 1.1469 * edad + 63.608) * 0.08284024 +
      10.892 * Math.pow(peso, 0.4409) * 0.04675999 +
      (91.888 * sexo - 5.1365) * 0.03997691 +
      (-49.62 * Math.log(creatinina_plasma) + 84.02) * 0.83042286;
    setPrediccion(prediccion.toFixed(2)); // Redondear a 2 decimales
  };

  const calcularMDR4 = () => {
    const { edad, sexo, creatinina_plasma, raza } = inputs;
    let factorSexo = sexo === 0 ? 1 : 0.742;
    let factorRaza = raza === 0 ? 1 : 1.212;

    const prediccion = 186 * Math.pow(creatinina_plasma, -1.154) * Math.pow(edad, -0.203) * factorSexo * factorRaza;

    setPrediccionMDR4(prediccion.toFixed(2));
  };

  const calcularCKDEPI = () => {
    const { edad, sexo, creatinina_plasma, raza } = inputs;
    let factorRaza = raza === 0 ? 1 : 1.159;
    if (creatinina_plasma < 0.7 && sexo === 1) {
      const prediccion = 144 * Math.pow(creatinina_plasma / 0.7, -0.329) * Math.pow(0.993, edad) * factorRaza;
      setPrediccionCKDEPI(prediccion.toFixed(2));
    }

    if (creatinina_plasma > 0.7 && sexo === 1) {
      const prediccion = 144 * Math.pow(creatinina_plasma / 0.7, -1.209) * Math.pow(0.993, edad) * factorRaza;
      setPrediccionCKDEPI(prediccion.toFixed(2));
    }

    if (creatinina_plasma > 0.9 && sexo === 0) {
      const prediccion = 141 * Math.pow(creatinina_plasma / 0.9, -1.209) * Math.pow(0.993, edad) * factorRaza;
      setPrediccionCKDEPI(prediccion.toFixed(2));
    }
    if (creatinina_plasma < 0.9 && sexo === 0) {
      const prediccion = 141 * Math.pow(creatinina_plasma / 0.9, -0.411) * Math.pow(0.993, edad) * factorRaza;
      setPrediccionCKDEPI(prediccion.toFixed(2));
    }
  };

  const calcularCockro = () => {
    const { edad, sexo, creatinina_plasma, peso } = inputs;
    let factorSexo = sexo === 0 ? 1 : 0.85;
    const prediccion = ((140 - edad) * peso * factorSexo) / creatinina_plasma / 60;
    setPrediccionCockro(prediccion.toFixed(2));
  };

  // Función para hacer la predicción
  const hacerPrediccion = async () => {
    const { edad, peso, creatinina_plasma } = inputs;

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

    calcularFOTC();
    calcularMDR4();
    calcularCKDEPI();
    calcularCockro();
    handlePredict();

    // Llama a la función predict del modelo

    if (prediccion < 0 || prediccionMDR4 < 0 || prediccionCKDEPI < 0 || prediccionCockro < 0) {
      setError("El cálculo de la Creatina no puede ser negativa");
      return;
    }
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
    <div className="container">
      <div className="app">
        <h1>Estimación del aclaramiento de creatinina</h1>
        <div className="inputGroup">
          <label>Edad:</label>
          <input type="number" name="edad" value={inputs.edad} required onChange={handleInputChange} />
        </div>
        <div className="inputGroup">
          <label>Peso (Kg):</label>
          <input type="number" name="peso" value={inputs.peso} onChange={handleInputChange} />
        </div>
        <div className="inputGroup">
          <label>Sexo:</label>
          <select name="sexo" value={inputs.sexo} onChange={handleInputChange}>
            <option value={0}>Hombre</option>
            <option value={1}>Mujer</option>
          </select>
        </div>
        <div className="inputGroup">
          <label>Creatinina en Plasma:</label>
          <input type="number" name="creatinina_plasma" value={inputs.creatinina_plasma} onChange={handleInputChange} />
        </div>
        <div className="inputGroup">
          <label>Raza Negra:</label>
          <select name="raza" value={inputs.raza} onChange={handleInputChange}>
            <option value={1}>Si</option>
            <option value={0}>No</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}

        <button className="button" onClick={hacerPrediccion}>
          Calcular
        </button>
        {prediccion !== null && (
          <div className="prediccion">
            <h2>Aclaramiento de Creatinina</h2>
            <h3>FOTC-HEG: {prediccion}</h3>
            <h3>MDR4: {prediccionMDR4}</h3>
            <h3>CKD-EPI: {prediccionCKDEPI}</h3>
            <h3>Cockcroft-Gault: {prediccionCockro}</h3>
            <h3>Random Forest: {prediccionRandomForest}</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Aclaramiento;
