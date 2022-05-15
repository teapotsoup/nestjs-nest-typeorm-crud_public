import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken'
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

const TEST_KEY = 'testKey'
const USER_ID = 1

jest.mock('jsonwebtoken', ()=>{ //jsonwebtoken을 mocking
    return {
        sign: jest.fn(()=>"TOKEN"),
        verify: jest.fn(()=>({id: USER_ID}))
    }
})


describe('JwtService', () => {
  let service: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { privateKey: TEST_KEY },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });
  it('should be defiend', () => {
    expect(service).toBeDefined();
  });
  describe('sign',()=>{
      it("should return a signed token", ()=>{
          const token = service.sign(USER_ID);
          expect(typeof token).toBe('string')
          expect(jwt.sign).toHaveBeenCalledTimes(1)
          expect(jwt.sign).toHaveBeenCalledWith({id:USER_ID},TEST_KEY)
          //console.log(jwt.sign({id:1}, "lalalala"))
      })
  })
  describe('verify', ()=>{
      it('should return the decoded token', ()=>{
        const TOKEN = "TOKEN"
        const decodedToken = service.verify(TOKEN)
        expect(decodedToken).toEqual({id:USER_ID})
        expect(jwt.verify).toHaveBeenCalledTimes(1)
        expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY)//
      })
  })
});