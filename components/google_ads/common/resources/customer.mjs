import { getOption } from "../utils.mjs";

const fields = [
  "auto_tagging_enabled",
  "call_reporting_setting.call_conversion_action",
  "call_reporting_setting.call_conversion_reporting_enabled",
  "call_reporting_setting.call_reporting_enabled",
  "conversion_tracking_setting.accepted_customer_data_terms",
  "conversion_tracking_setting.conversion_tracking_id",
  "conversion_tracking_setting.conversion_tracking_status",
  "conversion_tracking_setting.cross_account_conversion_tracking_id",
  "conversion_tracking_setting.enhanced_conversions_for_leads_enabled",
  "conversion_tracking_setting.google_ads_conversion_customer",
  "currency_code",
  "customer_agreement_setting.accepted_lead_form_terms",
  "descriptive_name",
  "final_url_suffix",
  "has_partners_badge",
  "id",
  "image_asset_auto_migration_done",
  "image_asset_auto_migration_done_date_time",
  "local_services_settings.granular_insurance_statuses",
  "local_services_settings.granular_license_statuses",
  "location_asset_auto_migration_done",
  "location_asset_auto_migration_done_date_time",
  "manager",
  "optimization_score",
  "optimization_score_weight",
  "pay_per_conversion_eligibility_failure_reasons",
  "remarketing_setting.google_global_site_tag",
  "resource_name",
  "status",
  "test_account",
  "time_zone",
  "tracking_url_template",
  "video_brand_safety_suitability",
].map((f) => getOption(f, "customer"));

const segments = [
  "ad_network_type",
  "auction_insight_domain",
  "click_type",
  "conversion_action",
  "conversion_action_category",
  "conversion_action_name",
  "conversion_adjustment",
  "conversion_lag_bucket",
  "conversion_or_adjustment_lag_bucket",
  "conversion_value_rule_primary_dimension",
  "date",
  "device",
  "external_conversion_source",
  "hour",
  "new_versus_returning_customers",
  "recommendation_type",
  "sk_ad_network_ad_event_type",
  "sk_ad_network_attribution_credit",
  "sk_ad_network_coarse_conversion_value",
  "sk_ad_network_conversion_value",
  "sk_ad_network_postback_sequence_index",
  "sk_ad_network_source_app.sk_ad_network_source_app_id",
  "sk_ad_network_source_domain",
  "sk_ad_network_source_type",
  "sk_ad_network_user_type",
  "slot",
].map((f) => getOption(f, "segments"));

const metrics = [
  "absolute_top_impression_percentage",
  "active_view_cpm",
  "active_view_ctr",
  "active_view_impressions",
  "active_view_measurability",
  "active_view_measurable_cost_micros",
  "active_view_measurable_impressions",
  "active_view_viewability",
  "all_conversions",
  "all_conversions_by_conversion_date",
  "all_conversions_from_interactions_rate",
  "all_conversions_from_location_asset_click_to_call",
  "all_conversions_from_location_asset_directions",
  "all_conversions_from_location_asset_menu",
  "all_conversions_from_location_asset_order",
  "all_conversions_from_location_asset_other_engagement",
  "all_conversions_from_location_asset_store_visits",
  "all_conversions_from_location_asset_website",
  "all_conversions_value",
  "all_conversions_value_by_conversion_date",
  "all_new_customer_lifetime_value",
  "auction_insight_search_absolute_top_impression_percentage",
  "auction_insight_search_impression_share",
  "auction_insight_search_outranking_share",
  "auction_insight_search_overlap_rate",
  "auction_insight_search_position_above_rate",
  "auction_insight_search_top_impression_percentage",
  "average_cart_size",
  "average_cost",
  "average_cpc",
  "average_cpe",
  "average_cpm",
  "average_cpv",
  "average_order_value_micros",
  "clicks",
  "content_budget_lost_impression_share",
  "content_impression_share",
  "content_rank_lost_impression_share",
  "conversions",
  "conversions_by_conversion_date",
  "conversions_from_interactions_rate",
  "conversions_value",
  "conversions_value_by_conversion_date",
  "cost_micros",
  "cost_of_goods_sold_micros",
  "cost_per_all_conversions",
  "cost_per_conversion",
  "cross_device_conversions",
  "cross_device_conversions_value_micros",
  "cross_sell_cost_of_goods_sold_micros",
  "cross_sell_gross_profit_micros",
  "cross_sell_revenue_micros",
  "cross_sell_units_sold",
  "ctr",
  "eligible_impressions_from_location_asset_store_reach",
  "engagement_rate",
  "engagements",
  "gross_profit_margin",
  "gross_profit_micros",
  "impressions",
  "interaction_event_types",
  "interaction_rate",
  "interactions",
  "invalid_click_rate",
  "invalid_clicks",
  "lead_cost_of_goods_sold_micros",
  "lead_gross_profit_micros",
  "lead_revenue_micros",
  "lead_units_sold",
  "new_customer_lifetime_value",
  "optimization_score_uplift",
  "optimization_score_url",
  "orders",
  "revenue_micros",
  "search_budget_lost_impression_share",
  "search_exact_match_impression_share",
  "search_impression_share",
  "search_rank_lost_impression_share",
  "sk_ad_network_installs",
  "sk_ad_network_total_conversions",
  "top_impression_percentage",
  "units_sold",
  "value_per_all_conversions",
  "value_per_all_conversions_by_conversion_date",
  "value_per_conversion",
  "value_per_conversions_by_conversion_date",
  "video_view_rate",
  "video_views",
  "view_through_conversions",
  "view_through_conversions_from_location_asset_click_to_call",
  "view_through_conversions_from_location_asset_directions",
  "view_through_conversions_from_location_asset_menu",
  "view_through_conversions_from_location_asset_order",
  "view_through_conversions_from_location_asset_other_engagement",
  "view_through_conversions_from_location_asset_store_visits",
  "view_through_conversions_from_location_asset_website",
].map((f) => getOption(f, "metrics"));

const resourceOption = {
  label: "Customer",
  value: "customer",
};

export const customer = {
  fields,
  segments,
  metrics,
  resourceOption,
};
