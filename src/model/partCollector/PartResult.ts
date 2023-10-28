export interface PartResult {
  part: {
    name: string;
    part_img_url: string;
    external_ids: {
      BrickLink: string[]
    }
  }
  color: {
    rgb: string;
    is_trans: boolean;
    external_ids: {
      BrickLink: {
        ext_ids: string[],
        ext_descrs: string[][]
      }
    }
  };
  quantity: number;
  is_spare: boolean;
  num_sets: number;
}