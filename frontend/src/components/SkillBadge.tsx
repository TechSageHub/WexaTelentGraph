interface SkillBadgeProps {
  name: string;
  variant?: 'brand' | 'slate' | 'green' | 'amber';
}

export function SkillBadge({ name, variant = 'brand' }: SkillBadgeProps) {
  const classMap = {
    brand: 'badge-brand',
    slate: 'badge-slate',
    green: 'badge-green',
    amber: 'badge-amber',
  };

  return (
    <span className={classMap[variant]} title={name}>
      {name}
    </span>
  );
}
