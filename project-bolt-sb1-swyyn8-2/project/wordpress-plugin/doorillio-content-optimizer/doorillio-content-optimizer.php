<?php
/**
 * Plugin Name: Doorillio Content Optimizer
 * Description: Integrates Doorillio content optimization with WordPress
 * Version: 1.0.0
 * Author: Doorillio
 */

if (!defined('ABSPATH')) {
    exit;
}

class DoorillioContentOptimizer {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_api_routes']);
        add_action('publish_post', [$this, 'handle_post_publish']);
        add_action('draft_to_publish', [$this, 'handle_draft_to_publish']);
    }

    public function register_api_routes() {
        register_rest_route('doorillio/v1', '/hooks', [
            'methods' => 'POST',
            'callback' => [$this, 'register_hook'],
            'permission_callback' => [$this, 'check_permission']
        ]);
    }

    public function handle_post_publish($post_id) {
        $this->trigger_webhook('publish_post', $post_id);
    }

    public function handle_draft_to_publish($post) {
        $this->trigger_webhook('draft_to_publish', $post->ID);
    }

    private function trigger_webhook($hook_name, $post_id) {
        $webhook_url = get_option("doorillio_webhook_{$hook_name}");
        if (!$webhook_url) return;

        wp_remote_post($webhook_url, [
            'body' => json_encode([
                'hook' => $hook_name,
                'post_id' => $post_id
            ]),
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Doorillio-Webhook' => wp_create_nonce('doorillio_webhook')
            ]
        ]);
    }

    public function check_permission() {
        return current_user_can('manage_options');
    }
}

new DoorillioContentOptimizer();