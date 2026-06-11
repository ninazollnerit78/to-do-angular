export function formatToISO(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function formatToDisplay(date: string): string {
  const [year, month, day] = date.split('-');

  return `${day}.${month}.${year}`;
}