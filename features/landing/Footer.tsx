import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 justify-center xl:grid-cols-4 lg:grid-cols-2 gap-8">
          <div className="col-span-2 hidden md:flex">
            <div className="md:w-128 md:h-32 flex md:flex-row flex-col">
              <img src="/logotipo_2.png" className="w-full object-cover hidden md:flex" alt="" />
              <p className="text-gray-300 mb-4 font-poppins">
              A plataforma que conecta clientes aos melhores prestadores de serviços.
              100% gratuita para clientes, com agendamento fácil e avaliações confiáveis.
            </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 ">Links Úteis</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors font-poppins">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors font-poppins">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors font-poppins">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-300 font-poppins">
              <li>contato@conectaservicos.com</li>
              <li>(11) 9999-9999</li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300 font-poppins">
          <p>&copy; {new Date().getFullYear()} Flik. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
