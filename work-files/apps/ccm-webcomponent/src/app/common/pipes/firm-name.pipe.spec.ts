import { FirmNamePipe } from './firm-name.pipe';

describe('FirmNamePipe', () => {
  it('create an instance', () => {
    const pipe = new FirmNamePipe();
    expect(pipe).toBeTruthy();
  });
  it('should return name', () => {
    const pipe = new FirmNamePipe();
    expect(pipe.transform({ name: 'test' } as any)).toEqual('test');
  });

  it('should return email', () => {
    const pipe = new FirmNamePipe();
    expect(pipe.transform({ businessEmail: ['test'] } as any)).toEqual('test');
  });
});
