import { FilesizePipe } from './filesize.pipe';

describe('FilesizePipe', () => {
  it('create an instance', () => {
    const pipe = new FilesizePipe();
    expect(pipe).toBeTruthy();
  });
  it('should return 1B', () => {
    const pipe = new FilesizePipe();
    expect(pipe.transform(1)).toEqual('1B');
  });
  it('should return 1.00kB', () => {
    const pipe = new FilesizePipe();
    expect(pipe.transform(1000)).toEqual('1.00kB');
  });
  it('should return 1.00mB', () => {
    const pipe = new FilesizePipe();
    expect(pipe.transform(1000000)).toEqual('1.00mB');
  });
  it('should return 1.00gB', () => {
    const pipe = new FilesizePipe();
    expect(pipe.transform(1000000000)).toEqual('1.00gB');
  });
});
