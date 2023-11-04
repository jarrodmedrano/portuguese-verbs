export const Checkboxes = (handleCheckbox: any) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { value: 'ar', color: 'blue', label: 'AR' },
        { value: 'ir', color: 'blue', label: 'IR' },
        { value: 'er', color: 'blue', label: 'ER' },
        { value: 'presente', color: 'green', label: 'Presente' },
        { value: 'preterito-perfeito', color: 'green', label: 'Pretérito Perfeito' },
        { value: 'preterito-imperfeito', color: 'green', label: 'Pretérito Imperfeito' },
        { value: 'futuro-do-presente', color: 'green', label: 'Futuro do Presente' },
        { value: 'presente-progressivo', color: 'green', label: 'Presente Progressivo' },
        { value: 'futuro-do-preterito', color: 'green', label: 'Futuro do Pretérito' },
      ].map((item) => (
        <label key={item.value} className={`block cursor-pointer`}>
          <input type="checkbox" className="mr-2" onClick={handleCheckbox} value={item.value} />
          <span
            className={`inline-block rounded px-3 py-2 text-xs text-white hover:bg-${item.color}-600 bg-${item.color}-500`}
          >
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};
