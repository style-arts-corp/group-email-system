import { noop } from 'lodash-es';

vi.spyOn(console, 'error').mockImplementation(noop);
