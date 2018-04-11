import '../styles/index.scss';

import Host from 'scripts/host';
import HomeComponent from './home/homeComponent';
import RootComponent from 'scripts/shared/rootComponent';

let host = new Host();
let container = host.getContainer();

container.bind<RootComponent>('RootComponent').to(HomeComponent).inSingletonScope();

host.run();