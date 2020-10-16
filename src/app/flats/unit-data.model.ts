import { FeedbackData } from '../feedbacks/feedback-data.model';
import { UnitAddress } from './address.model';
import { Flat } from './flat.model';

export interface UnitData{
  address: UnitAddress,
  flat: Flat,
  feedbacks: FeedbackData[]
}
