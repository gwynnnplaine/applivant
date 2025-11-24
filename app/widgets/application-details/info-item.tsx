import { DollarSign, MapPin, LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  text: string;
  label?: string;
}

export function InfoItem({ icon: Icon, text, label }: InfoItemProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm" aria-label={label}>
        {text}
      </span>
    </div>
  );
}

export function SalaryInfo({ salary }: { salary?: string }) {
  if (!salary) return null;

  return <InfoItem icon={DollarSign} text={salary} label="Salary" />;
}

export function LocationInfo({ location }: { location?: string }) {
  if (!location) return null;

  return <InfoItem icon={MapPin} text={location} label="Location" />;
}
