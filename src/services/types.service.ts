
// ============== BASE INTERFACES ==============

export interface IBase {
  id: string,
  createdAt: Date,
  updatedAt: Date,
}

export interface IPerson extends IBase {
  firstName: string,
  lastName: string,
  gender: ENGender,
  dob: Date,
  nationality: string,
  profilePicture?: string,
}

export interface IUser extends IBase {
  email: string,
  passwordHash: string,
  isEmailVerified: boolean,
  lastLogin?: Date,
  personId: string,
}

// ============== ENUMS ==============

// access.prisma
export enum ENGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ENUserTokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
}

export enum ENUserTokenStatus {
  PENDING = 'PENDING',
  DISRUPTED = 'DISRUPTED',
}

export enum ENMembershipStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum ENMembershipType {
  OWNER = 'OWNER',
  STAFF = 'STAFF',
  ATHLETE = 'ATHLETE',
  GUARDIAN = 'GUARDIAN',
  BOARD = 'BOARD',
}

export enum ENClubStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

export enum ENInvitationStatus {
  PENDING = 'PENDING',
  DISRUPTED = 'DISRUPTED',
}

// system.prisma
export enum ENAuditCategory {
  AUTH = 'AUTH',
  IAM = 'IAM',
  CLUB = 'CLUB',
  TEAM = 'TEAM',
  ATHLETE = 'ATHLETE',
  TRAINING = 'TRAINING',
  MATCH = 'MATCH',
  MEDICAL = 'MEDICAL',
  FINANCE = 'FINANCE',
  SYSTEM = 'SYSTEM',
  MEMBERSHIP = 'MEMBERSHIP',
}

export enum ENNotificationType {
  SYSTEM = 'SYSTEM',
  TRAINING = 'TRAINING',
  MATCH = 'MATCH',
}

// profile.prisma
export enum ENAthletePosition {
  GOALKEEPER = 'GOALKEEPER',
  DEFENDER = 'DEFENDER',
  MIDFIELDER = 'MIDFIELDER',
  FORWARD = 'FORWARD',
}

export enum ENPreferredFoot {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BOTH = 'BOTH',
}

export enum ENCoachPosition {
  HEAD_COACH = 'HEAD_COACH',
  ASSISTANT_COACH = 'ASSISTANT_COACH',
  GOALKEEPER_COACH = 'GOALKEEPER_COACH',
  FITNESS_COACH = 'FITNESS_COACH',
  TECHNICAL_COACH = 'TECHNICAL_COACH',
  ANALYST = 'ANALYST',
}

export enum ENCoachResponsibility {
  TRAINING = 'TRAINING',
  TACTICS = 'TACTICS',
  ATHLETE_DEVELOPMENT = 'ATHLETE_DEVELOPMENT',
  MATCH_ANALYSIS = 'MATCH_ANALYSIS',
  FITNESS = 'FITNESS',
  GOALKEEPING = 'GOALKEEPING',
  SCOUTING = 'SCOUTING',
}

// pbac.prisma
export enum ENPermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
  ASSIGN = 'ASSIGN',
}

export enum ENMembershipPermissionAction {
  GRANT = 'GRANT',
  REVOKE = 'REVOKE',
}

// feature.prisma
export enum ENFeature {
  IAM = 'IAM',
  CLUB = 'CLUB',
  TEAM = 'TEAM',
  ATHLETE = 'ATHLETE',
  TRAINING = 'TRAINING',
  MATCH = 'MATCH',
  SIGNING = 'SIGNING',
  MEDICAL = 'MEDICAL',
  FINANCE = 'FINANCE',
}

export enum ENClubFeatureStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export enum ENTrainingStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ENTrainingType {
  PHYSICAL = 'PHYSICAL',
  MENTAL = 'MENTAL',
  TECHNICAL = 'TECHNICAL',
  TACTICAL = 'TACTICAL',
}

// ============== ACCESS / IAM TYPES ==============

export interface IUserToken {
  id: string,
  type: ENUserTokenType,
  hash: string,
  expiresAt: Date,
  usedAt?: Date,
  status: ENUserTokenStatus,
  userId: string,
  createdAt: Date,
}

export interface IMembership extends IBase {
  status: ENMembershipStatus,
  joinedAt: Date,
  endedAt?: Date,
  personId: string,
  clubId: string,
}

export interface IMembershipType {
  membershipId: string,
  type: ENMembershipType,
}

export interface IClub extends IBase {
  name: string,
  shortName?: string,
  logo?: string,
  country: string,
  timezone: string,
  createdById?: string,
  status: ENClubStatus,
}

export interface IInvitation extends IBase {
  email: string,
  tokenHash: string,
  type: ENMembershipType,
  status: ENInvitationStatus,
  teamId?: string,
  expiresAt: Date,
  acceptedAt?: Date,
  clubId: string,
  inviterId: string,
  acceptedByUserId?: string,
}

// ============== SYSTEM TYPES ==============

export interface IAuditLog {
  id: string,
  category: ENAuditCategory,
  action: string,
  entityType: string,
  description: string,
  metadata?: Record<string, unknown>,
  createdBy?: string,
  createdAt: Date,
}

export interface INotification {
  id: string,
  type: ENNotificationType,
  title: string,
  description: string,
  createdBy?: string,
  createdAt: Date,
}

// ============== PROFILE TYPES ==============

export interface IProfile extends IBase {
  personId: string,
  phoneNumber?: string,
  profilePic?: string,
  sendEmailNotification: boolean,
}

export interface IAthleteProfile extends IBase {
  profileId: string,
  position?: ENAthletePosition,
  preferredFoot?: ENPreferredFoot,
  heightCm?: number,
  weightKg?: number,
}

export interface ICoachAssignment extends IBase {
  membershipId: string,
  teamId: string,
  responsabilities: ENCoachResponsibility[],
  position: ENCoachPosition,
}

export interface ICoachProfile {
  id: string,
  specialization?: string,
  license?: string,
  profileId: string,
}

// ============== PBAC TYPES ==============

export interface IPermission extends IBase {
  code: string,
  name: string,
  description: string,
  module: ENFeature,
  action: ENPermissionAction,
}

export interface IRole extends IBase {
  code: string,
  name: string,
  description: string,
  isSystem: boolean,
  clubId?: string,
}

export interface IRolePermission {
  id: string,
  roleId: string,
  permissionId: string,
}

export interface IMembershipRole {
  id: string,
  membershipId: string,
  roleId: string,
  assignedById?: string,
  assignedAt: Date,
}

export interface IMembershipPermission {
  id: string,
  membershipId: string,
  permissionId: string,
  action: ENMembershipPermissionAction,
}

// ============== FEATURE TYPES ==============

export interface IFeature extends IBase {
  code: ENFeature,
  name: string,
  description?: string,
  isCore: boolean,
  isActive: boolean,
}

export interface IClubFeature extends IBase {
  clubId: string,
  featureId: string,
  status: ENClubFeatureStatus,
  enabledById?: string,
  enabledAt?: Date,
}

export interface ITraining extends IBase {
  clubId: string,
  teamId: string,
  types: ENTrainingType[],
  title?: string,
  description?: string,
  startsAt: Date,
  endsAt: Date,
  location?: string,
  status: ENTrainingStatus,
}

export interface IAthlete {
  id: string,
  membershipId: string,
  teamId: string,
  joinedAt: Date,
  leftAt?: Date,
}

export interface ITeam extends IBase {
  clubId: string,
  name: string,
}

// ============== AGGREGATE / DERIVED TYPES ==============
// A "Detail" variant = base model + all its relation fields resolved.
// Rule: any Prisma model that has at least one relation (to-one or to-many) gets a Detail interface below.

export interface IPersonDetail extends IPerson {
  profile?: IProfile,
  user?: IUser,
  memberships: IMembership[],
}

export interface IUserDetail extends IUser {
  person: IPerson,
  tokens: IUserToken[],
  acceptedInvitations: IInvitation[],
  seenNotifications: INotification[],
  sentNotifications: INotification[],
}

export interface IUserWithPerson extends IUser {
  person: IPerson,
}

export interface IUserWithProfile extends IUserWithPerson {
  profile?: IProfile,
}

export interface IUserTokenDetail extends IUserToken {
  user: IUser,
}

export interface IMembershipTypeDetail extends IMembershipType {
  membership: IMembership,
}

export interface IInvitationDetail extends IInvitation {
  club: IClub,
  inviter: IMembership,
  acceptedByUser?: IUser,
}

export interface INotificationDetail extends INotification {
  seenBy: IUser[],
  sentFor: IUser[],
}

export interface IProfileDetail extends IProfile {
  person: IPerson,
  athleteProfile?: IAthleteProfile,
  coachProfile?: ICoachProfile,
}

export interface IAthleteProfileDetail extends IAthleteProfile {
  profile: IProfile,
}

export interface ICoachProfileDetail extends ICoachProfile {
  profile: IProfile,
}

export interface ICoachDetail extends ICoachAssignment {
  membership: IMembership & {
    person: IPerson,
    profile?: IProfile & {
      coachProfile?: ICoachProfile,
    },
  },
  team: ITeam,
}

export interface IPermissionDetail extends IPermission {
  rolePermissions: IRolePermission[],
  membershipPermissions: IMembershipPermission[],
}

export interface IRoleDetail extends IRole {
  club?: IClub,
  memberships: IMembershipRole[],
  permissions: IRolePermission[],
}

export interface IRolePermissionDetail extends IRolePermission {
  role: IRole,
  permission: IPermission,
}

export interface IMembershipRoleDetail extends IMembershipRole {
  membership: IMembership,
  role: IRole,
  assignedBy?: IMembership,
}

export interface IMembershipPermissionDetail extends IMembershipPermission {
  membership: IMembership,
  permission: IPermission,
}

export interface IFeatureDetail extends IFeature {
  clubFeatures: IClubFeature[],
}

export interface IClubFeatureDetail extends IClubFeature {
  club: IClub,
  feature: IFeature,
  enabledBy?: IMembership,
}

export interface ITrainingDetail extends ITraining {
  club: IClub,
  team: ITeam,
}

export interface IAthleteDetail extends IAthlete {
  membership: IMembership & {
    person: IPerson,
    profile?: IProfile & {
      athleteProfile?: IAthleteProfile,
    },
  },
  team: ITeam,
}

export interface ITeamDetail extends ITeam {
  club: IClub,
  trainings: ITraining[],
  athletes: IAthleteDetail[],
  coachAssignments: ICoachDetail[],
}

export interface IClubDetail extends IClub {
  createdBy?: IMembership,
  memberships: IMembership[],
  invitations: IInvitation[],
  teams: ITeam[],
  trainings: ITraining[],
  features: IClubFeature[],
  roles: IRole[],
}

export interface IMembershipDetail extends IMembership {
  person: IPerson,
  club: IClub,
  user?: IUser,
  profile?: IProfile,
  roles: IMembershipRole[],
  permissions: IMembershipPermission[],
  assignedRoles: IMembershipRole[],
  createdClubs: IClub[],
  sentInvitations: IInvitation[],
  athlete?: IAthlete,
  coachAssignments: ICoachAssignment[],
  enabledFeatures: IClubFeature[],
}

