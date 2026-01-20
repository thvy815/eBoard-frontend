interface Props {
  className: string;
  title: string;
}

export default function FundIncomeInfoHeader({
  className,
  title,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div>
        <p className="text-sm text-gray-400">Lớp</p>
        <p className="font-medium">{className}</p>
      </div>

      <div>
        <p className="text-sm text-gray-400">Nội dung thu</p>
        <p className="font-medium">{title}</p>
      </div>
    </div>
  );
}
