import { resolvers } from './root-resolvers'
import * as fetch from 'jest-fetch-mock'
import TrackingId from './gateway-plugin/model/trackingId'

describe('Registration root resolvers', () => {
  describe('listBirthRegistrations()', () => {
    it('returns an array of composition results', async () => {
      fetch.mockResponseOnce(JSON.stringify({ entry: [{}, {}] }))
      // @ts-ignore
      const compositions = await resolvers.Query.listBirthRegistrations(
        {},
        { status: 'preliminary' }
      )

      expect(compositions).toBeDefined()
      expect(compositions).toBeInstanceOf(Array)
      expect(compositions).toHaveLength(2)
    })
  })
  let findSpy: jest.Mock
  let saveSpy: jest.Mock
  const details = {
    child: {
      name: [{ use: 'Traditional', firstNames: 'অনিক', familyName: 'হক' }]
    },
    mother: {
      name: [{ use: 'Traditional', firstNames: 'তাহসিনা', familyName: 'হক' }],
      telecom: [{ system: 'phone', value: '+8801622688231' }]
    },
    registration: { contact: 'MOTHER' }
  }
  describe('createBirthRegistration()', () => {
    beforeEach(() => {
      findSpy = jest.spyOn(TrackingId, 'findOne').mockResolvedValueOnce(null)
      saveSpy = jest
        .spyOn(TrackingId.prototype, 'save')
        .mockImplementationOnce(() => {
          return { trackingId: 'B123456' }
        })
    })
    it('posts a fhir bundle', async () => {
      fetch.mockResponseOnce(
        JSON.stringify({
          resourceType: 'Bundle',
          entry: [
            {
              response: { location: 'Patient/12423/_history/1' }
            }
          ]
        })
      )
      // @ts-ignore
      const result = await resolvers.Mutation.createBirthRegistration(
        {},
        { details }
      )

      expect(result).toBeDefined()
      expect(result.length).toBe(7)
      expect(result).toMatch(/^B/)
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      )
      expect(findSpy).toBeCalled()
      expect(saveSpy).toBeCalled()
    })

    it('throws an error when the request returns an error code', async () => {
      fetch.mockResponseOnce('Boom!', { status: 401 })
      await expect(
        // @ts-ignore
        resolvers.Mutation.createBirthRegistration({}, { details })
      ).rejects.toThrowError('FHIR post to /fhir failed with [401] body: Boom!')
      expect(findSpy).toBeCalled()
      expect(saveSpy).toBeCalled()
    })

    it("throws an error when the response isn't what we expect", async () => {
      fetch.mockResponseOnce(JSON.stringify({ unexpected: true }))
      await expect(
        // @ts-ignore
        resolvers.Mutation.createBirthRegistration({}, { details })
      ).rejects.toThrowError('FHIR response did not send a valid response')
      expect(findSpy).toBeCalled()
      expect(saveSpy).toBeCalled()
    })
  })
})
