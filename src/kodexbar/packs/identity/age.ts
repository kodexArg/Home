export const GABRIEL_CAVEDAL_BIRTH_YEAR = 1978;
export const GABRIEL_CAVEDAL_BIRTH_MONTH = 4;
export const GABRIEL_CAVEDAL_BIRTH_DAY = 4;

export function computeGabrielCavedalAgeInYears(referenceDate: Date = new Date()): number {
	const referenceYear = referenceDate.getUTCFullYear();
	const referenceMonth = referenceDate.getUTCMonth() + 1;
	const referenceDay = referenceDate.getUTCDate();

	const hasHadBirthdayThisYear =
		referenceMonth > GABRIEL_CAVEDAL_BIRTH_MONTH ||
		(referenceMonth === GABRIEL_CAVEDAL_BIRTH_MONTH && referenceDay >= GABRIEL_CAVEDAL_BIRTH_DAY);

	return referenceYear - GABRIEL_CAVEDAL_BIRTH_YEAR - (hasHadBirthdayThisYear ? 0 : 1);
}
