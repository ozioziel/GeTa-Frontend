import '../styles/FormCard.css';

function FormCard({ children }) {
  return (
    <section className="form-card">
      {
        children
      }
    </section>
  );
}

export default FormCard;