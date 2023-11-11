import { ChangeEvent } from 'react';

export const Checkboxes = ({
  handleCheckbox,
  isOpen,
}: {
  handleCheckbox: (event: ChangeEvent<HTMLInputElement>) => void;
  isOpen: boolean;
}) => {
  return (
    <div className={`${isOpen ? 'gap-4 md:grid-cols-3' : 'md:grid-cols-1'} grid  `} id="grid gap-4 md:grid-cols-3">
      {[
        { value: 'ar', color: 'bg-blue-600', label: 'AR' },
        { value: 'ir', color: 'bg-blue-600', label: 'IR' },
        { value: 'er', color: 'bg-blue-600', label: 'ER' },
        { value: 'irregular', color: 'bg-amber-400', label: 'Irregular' },
        { value: 'regular', color: 'bg-amber-400', label: 'Regular' },
        { value: 'presente', color: 'bg-lime-600', label: 'Presente' },
        { value: 'preterito-perfeito', color: 'bg-lime-600', label: 'Pretérito Perfeito' },
        { value: 'preterito-imperfeito', color: 'bg-lime-600', label: 'Pretérito Imperfeito' },
        { value: 'futuro-do-presente', color: 'bg-lime-600', label: 'Futuro do Presente' },
        { value: 'presente-progressivo', color: 'bg-lime-600', label: 'Presente Progressivo' },
        { value: 'futuro-do-preterito', color: 'bg-lime-600', label: 'Futuro do Pretérito' },
      ].map((item) => (
        <label key={item.value} className={`block cursor-pointer`}>
          <input type="checkbox" className="mr-2" onChange={handleCheckbox} value={item.value} />
          <span
            className={`inline-block rounded px-3 py-2 text-xs text-white hover:bg-${item.color}-600 ${item.color}`}
          >
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
};
