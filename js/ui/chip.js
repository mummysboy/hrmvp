// Simple chip utility for status/type pills

const STATUS_TO_CLASS = {
  'Active': 'chip--ok',
  'On Leave': 'chip--warn',
  'Terminated': 'chip--bad'
};

const TYPE_TO_CLASS = {
  'Faculty': 'chip--neutral',
  'Staff': 'chip--neutral',
  'Student': 'chip--info',
  'Postdoc': 'chip--info',
  'Temp': 'chip--muted'
};

export function chip(value, kind = 'status') {
  const cls = kind === 'status' ? (STATUS_TO_CLASS[value] || 'chip--muted') : (TYPE_TO_CLASS[value] || 'chip--muted');
  return `<span class="chip ${cls}" aria-label="${kind}: ${value}">${value}</span>`;
}


