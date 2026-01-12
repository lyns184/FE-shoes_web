type TotalCardProps = {
  title: string;
  amount: number;
  unit?: string;
};

const TotalCard = ({ title, amount, unit }: TotalCardProps) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-neutral-200 p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-neutral-900 text-2xl font-normal mb-2">{title}</h3>
          <p className="text-neutral-900 text-3xl lg:text-4xl font-bold truncate">
            {amount.toLocaleString()}{unit}
          </p>
        </div>
        <div className="bg-emerald-200 rounded-2xl p-4 flex items-center justify-center shrink-0 ml-4">
          <svg width="19" height="32" viewBox="0 0 19 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 1.33333V30.6667M16.1667 6.66666H6.16667C4.92899 6.66666 3.74201 7.15833 2.86684 8.0335C1.99167 8.90867 1.5 10.0957 1.5 11.3333C1.5 12.571 1.99167 13.758 2.86684 14.6332C3.74201 15.5083 4.92899 16 6.16667 16H12.8333C14.071 16 15.258 16.4917 16.1332 17.3668C17.0083 18.242 17.5 19.429 17.5 20.6667C17.5 21.9043 17.0083 23.0913 16.1332 23.9665C15.258 24.8417 14.071 25.3333 12.8333 25.3333H1.5" stroke="#009951" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TotalCard;