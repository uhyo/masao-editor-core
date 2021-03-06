import { param, format, customParts } from 'masao';

export { param, format };
export const customPartsProperties = customParts.customPartsProperties;
export type MasaoJSONFormat = format.MasaoJSONFormat;
export type AdvancedMap = format.AdvancedMap;
export type CustomPartsProperty = customParts.CustomPartsProperty;
export type CustomPartsPropertySet = customParts.CustomPartsPropertySet;
export type IntegerProperty = customParts.IntegerProperty;

/**
 * default field name of editor-specific data.
 */
export const extFieldDefault = '_meme_core';
/**
 * Editor-specific data saved in masao-json-format.
 */
export interface MJSExtFields {
  customParts?: Record<
    string,
    {
      name: string;
    }
  >;
}

export interface ParamType {
  name: string;
  params: Array<string>;
}
//paramの分類
export const paramTypes: Record<string, ParamType> = {
  stage: {
    name: '全般',
    params: [
      'time_max',
      'scroll_area',
      'scroll_mode',
      'scroll_mode_s',
      'scroll_mode_t',
      'scroll_mode_f',
      'view_move_type',
      'game_speed',
      'clear_type',
      'easy_mode',
      'stage_max',
      'stage_select',
      'stage_kaishi',
      'water_visible',
      'water_clear_switch',
      'water_clear_level',
      'pause_switch',
      'score_v',
      'score_1up_1',
      'score_1up_2',
      'moji_grenade',
      'moji_highscore',
      'moji_jet',
      'moji_left',
      'moji_score',
      'moji_size',
      'moji_time',
      'now_loading',
    ],
  },
  jibun: {
    name: '主人公',
    params: [
      'j_hp',
      'j_hp_name',
      'jibun_left_shoki',
      'j_enemy_press',
      'j_tail_hf',
      'j_tail_type',
      'j_tail_ap_boss',
      'j_fire_equip',
      'j_fire_mkf',
      'j_fire_type',
      'j_equip_grenade',
      'j_tokugi',
      'j_add_tokugi',
      'j_add_tokugi2',
      'j_add_tokugi3',
      'j_add_tokugi4',
    ],
  },
  item: {
    name: 'アイテム',
    params: [
      'j_tail_type',
      'j_tail_ap_boss',
      'j_fire_mkf',
      'j_fire_type',
      'suberuyuka_hkf',
      'grenade_type',
      'grenade_@@@1',
      'grenade_@@@2',
    ],
  },
  enemy: {
    name: '敵',
    params: [
      'dengeki_mkf',
      'chikorin_attack',
      'poppie_attack',
      'mariri_attack',
      'yachamo_kf',
      'mizutaro_attack',
      'airms_kf',
      'taiking_attack',
      'kuragesso_attack',
    ],
  },
  boss: {
    name: 'ボス',
    params: [
      'boss_destroy_type',
      'boss_hp_max',
      'boss_name',
      'boss_type',
      'boss2_name',
      'boss2_type',
      'boss3_name',
      'boss3_type',
      'oriboss_v',
      'oriboss_x',
      'oriboss_y',
      'oriboss_name',
      'oriboss_hp',
      'oriboss_speed',
      'oriboss_waza1',
      'oriboss_waza1_wait',
      'oriboss_waza2',
      'oriboss_waza2_wait',
      'oriboss_waza3',
      'oriboss_waza3_wait',
      'oriboss_waza_select',
      'oriboss_waza_select_option',
      'oriboss_width',
      'oriboss_height',
      'oriboss_anime_type',
      'oriboss_ugoki',
      'oriboss_destroy',
      'oriboss_fumeru_f',
      'oriboss_tail_f',
    ],
  },
  athletic: {
    name: '仕掛け',
    params: [
      'ugokuyuka1_type',
      'ugokuyuka2_type',
      'ugokuyuka3_type',
      'coin1_type',
      'coin3_type',
      'dossunsun_type',
      'firebar1_type',
      'firebar2_type',
      'dokan1_type',
      'dokan2_type',
      'dokan3_type',
      'dokan4_type',
      'dokan_mode',
      'url1',
      'url2',
      'url3',
      'url4',
      'door_score',
      'key1_on_count',
      'key2_on_count',
      'grenade_shop_score',
      'hitokoto1_name',
      'hitokoto1-1',
      'hitokoto1-2',
      'hitokoto1-3',
      'hitokoto2_name',
      'hitokoto2-1',
      'hitokoto2-2',
      'hitokoto2-3',
      'hitokoto3_name',
      'hitokoto3-1',
      'hitokoto3-2',
      'hitokoto3-3',
      'hitokoto4_name',
      'hitokoto4-1',
      'hitokoto4-2',
      'hitokoto4-3',
      'mes1_name',
      'serifu1-1',
      'serifu1-2',
      'serifu1-3',
      'serifu2-1',
      'serifu2-2',
      'serifu2-3',
      'mes2_name',
      'serifu3-1',
      'serifu3-2',
      'serifu3-3',
      'serifu4-1',
      'serifu4-2',
      'serifu4-3',
      'fs_name',
      'serifu7-1',
      'serifu7-2',
      'serifu7-3',
      'fs_item_name1',
      'fs_item_name2',
      'fs_item_name3',
      'fs_serifu1',
      'fs_serifu2',
      'serifu_grenade_shop_name',
      'serifu_grenade_shop-1',
      'serifu_grenade_shop-2',
      'serifu_grenade_shop-3',
      'serifu_grenade_shop-4',
      'serifu_grenade_shop-5',
      'serifu_grenade_shop-6',
      'serifu_key1_on_name',
      'serifu_key1_on-1',
      'serifu_key1_on-2',
      'serifu_key1_on-3',
      'serifu_key1_on-4',
      'serifu_key1_on-5',
      'serifu_key1_on-6',
      'serifu_key1_on-7',
      'serifu_key1_on-8',
      'serifu_key1_on-9',
      'serifu_key1_on-10',
      'serifu_key2_on_name',
      'serifu_key2_on-1',
      'serifu_key2_on-2',
      'serifu_key2_on-3',
      'serifu_key2_on-4',
      'serifu_key2_on-5',
      'serifu_key2_on-6',
      'serifu_key2_on-7',
      'serifu_key2_on-8',
      'serifu_key2_on-9',
      'serifu_key2_on-10',
      'shop_name',
      'shop_serifu1',
      'shop_serifu2',
      'shop_serifu3',
      'shop_serifu4',
      'shop_serifu5',
      'shop_serifu6',
      'shop_item_name1',
      'shop_item_teika1',
      'shop_item_name2',
      'shop_item_teika2',
      'shop_item_name3',
      'shop_item_teika3',
      'shop_item_name4',
      'shop_item_teika4',
      'shop_item_name5',
      'shop_item_teika5',
      'shop_item_name6',
      'shop_item_teika6',
      'shop_item_name7',
      'shop_item_teika7',
      'shop_item_name8',
      'shop_item_teika8',
      'shop_item_name9',
      'shop_item_teika9',
      'serifu5-1',
      'serifu5-2',
      'serifu5-3',
      'serifu8-1',
      'serifu8-2',
      'serifu8-3',
      'serifu9-1',
      'serifu9-2',
      'serifu9-3',
      'setumei_name',
      'setumei_menu1',
      'setumei_menu2',
      'setumei_menu3',
      'setumei_menu4',
      'serifu10-1',
      'serifu10-2',
      'serifu10-3',
      'serifu11-1',
      'serifu11-2',
      'serifu11-3',
      'serifu12-1',
      'serifu12-2',
      'serifu12-3',
      'control_parts_visible',
    ],
  },
  background: {
    name: '背景',
    params: [
      'layer_mode',
      'mcs_haikei_visible',
      'backcolor_@@@',
      'backcolor_@@@_s',
      'backcolor_@@@_t',
      'backcolor_@@@_f',
      'gazou_scroll',
      'gazou_scroll_speed_x',
      'gazou_scroll_speed_y',
      'gazou_scroll_x',
      'gazou_scroll_y',
      'second_gazou_visible',
      'second_gazou_priority',
      'second_gazou_scroll',
      'second_gazou_scroll_x',
      'second_gazou_scroll_y',
      'second_gazou_scroll_speed_x',
      'second_gazou_scroll_speed_y',
      'x_backimage1_view_x',
      'x_backimage2_view_x',
      'x_backimage3_view_x',
      'x_backimage4_view_x',
      'x_image1_view_x',
      'x_image1_x',
      'x_image1_y',
      'x_image2_view_x',
      'x_image2_x',
      'x_image2_y',
      'x_image3_view_x',
      'x_image3_x',
      'x_image3_y',
      'x_image4_view_x',
      'x_image4_x',
      'x_image4_y',
    ],
  },
  color: {
    name: '色',
    params: [
      'backcolor_@@@',
      'backcolor_@@@_s',
      'backcolor_@@@_t',
      'backcolor_@@@_f',
      'scorecolor_@@@',
      'kaishi_@@@',
      'firebar_@@@1',
      'firebar_@@@2',
      'grenade_@@@1',
      'grenade_@@@2',
      'mizunohadou_@@@',
    ],
  },
  audio: {
    name: '音声',
    params: [
      'se_switch',
      'fx_bgm_switch',
      'fx_bgm_loop',
      'se_filename',
      'audio_bgm_switch_mp3',
      'audio_bgm_switch_ogg',
      'audio_bgm_switch_wave',
      'audio_se_switch_mp3',
      'audio_se_switch_ogg',
      'audio_se_switch_wave',
    ],
  },
  /*"resource": {
        name: "リソース",
        params: [
            "filename_chizu",
            "filename_ending",
            "filename_fx_bgm_boss",
            "filename_fx_bgm_chizu",
            "filename_fx_bgm_ending",
            "filename_fx_bgm_stage1",
            "filename_fx_bgm_stage2",
            "filename_fx_bgm_stage3",
            "filename_fx_bgm_stage4",
            "filename_fx_bgm_title",
            "filename_gameover",
            "filename_haikei",
            "filename_haikei2",
            "filename_haikei3",
            "filename_haikei4",
            "filename_mapchip",
            "filename_oriboss_left1",
            "filename_oriboss_left2",
            "filename_oriboss_right1",
            "filename_oriboss_right2",
            "filename_oriboss_tubure_left",
            "filename_oriboss_tubure_right",
            "filename_pattern",
            "filename_se_block",
            "filename_se_bomb",
            "filename_se_chizugamen",
            "filename_se_clear",
            "filename_se_coin",
            "filename_se_dengeki",
            "filename_se_dokan",
            "filename_se_dosun",
            "filename_se_fireball",
            "filename_se_fumu",
            "filename_se_gameover",
            "filename_se_get",
            "filename_se_grounder",
            "filename_se_happa",
            "filename_se_hinoko",
            "filename_se_item",
            "filename_se_jet",
            "filename_se_jump",
            "filename_se_kaiole",
            "filename_se_kiki",
            "filename_se_miss",
            "filename_se_mizu",
            "filename_se_mizudeppo",
            "filename_se_senkuuza",
            "filename_se_sjump",
            "filename_se_start",
            "filename_se_tobasu",
            "filename_second_haikei",
            "filename_second_haikei2",
            "filename_second_haikei3",
            "filename_second_haikei4",
            "filename_title",
            "filename_ximage1",
            "filename_ximage2",
            "filename_ximage3",
            "filename_ximage4",
            "x_backimage1_filename",
            "x_backimage2_filename",
            "x_backimage3_filename",
            "x_backimage4_filename",
        ]
    },*/
};

//対応可能なバージョンに変換
export function acceptVersion(version: string) {
  if (version === '2.7' || version === '2.8') {
    return '2.8';
  } else if (version === 'kani' || version === 'kani2') {
    return 'kani2';
  }
  return 'fx16';
}
