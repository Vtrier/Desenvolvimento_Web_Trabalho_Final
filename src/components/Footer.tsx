export default function Footer() {
  return (
    <footer 
      className="w-full"
      aria-label="Rodapé institucional"
    >
      <div className="max-width-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} TaskFlow. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}