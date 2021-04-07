import SearchDanAbramov from './dan-abramov'
import SearchColbyFayock from './colby-fayock'
import SearchJohnLindquist from './john-lindquist'
import SearchLaurieBarth from './laurie-barth'
import SearchFlavioCorpa from './flavio-corpa'
import SearchHirokoNishimura from './hiroko-nishimura'
import SearchChrisBiscardi from './chris-biscardi'

const InstructorsIndex: any = {
  'dan-abramov': SearchDanAbramov,
  'colby-fayock': SearchColbyFayock,
  'john-lindquist': SearchJohnLindquist,
  'laurie-barth': SearchLaurieBarth,
  'flavio-corpa': SearchFlavioCorpa,
  'hiro-nishimura': SearchHirokoNishimura,
  'chris-biscardi': SearchChrisBiscardi,
}

export default InstructorsIndex
