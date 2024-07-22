/**
* 2007-2024 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author    PrestaShop SA <contact@prestashop.com>
*  @copyright 2007-2024 PrestaShop SA
*  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*
* Don't forget to prefix your containers with your own identifier
* to avoid any conflicts with others containers.
*/
$(document).ready(function () {
    $(document).on('change', '#omniversepricing_lang_changer', function () {
        var $val = $(this).val();
        var $prdid = $('#prd_id').val();
        $.ajax({
            type: 'POST',
            url: omniversepricing_ajax_url,
            dataType: 'html',
            data: {
                controller: 'AdminAjaxOmniverseLite',
                action: 'OmniverseChangeLang',
                prdid: $prdid,
                langid: $val,
                shopid: omniversepricing_shop_id,
                ajax: true
            },
            success: function (data) {
                var $data = JSON.parse(data);
                if (typeof $data.success !== 'undefined' && $data.success) {
                    $('#omniversepricing_history_table').find(".omniversepricing-history-datam").remove();
                    $.each($data.omniverse_prices, function (key, value) {
                        $('#omniversepricing_history_table').append('<tr class="omniversepricing-history-datam" id="omniversepricing_history_' + value.id + '">'
                            + '<td>' + value.date + '</td><td>' + value.price + '</td><td>' + value.promotext + '</td>'
                            + '<td><button disabled="disabled"  class="omniversepricing_history_delete btn btn-danger" type="button" value="' + value.id + '">Delete</button></td>'
                            + '</tr>');
                    });
                }
            }
        });
    });

    $(document).on('click', '#omni_sync_bt_lite', function () {
        $(".omni-sync-loader").show();
        call_sync_ajax_lite(0);
        $('#omni_sync_bt_lite').html("Syncing 0/" + omniversepricing_total_products + " products")
    });

    function call_sync_ajax_lite(start) {
        $.ajax({
            type: 'POST',
            url: omniversepricing_ajax_url,
            dataType: 'html',
            data: {
                controller: 'AdminAjaxOmniverseLite',
                action: 'OmniDataSync',
                start: start,
                ajax: true
            },
            success: function (data) {
                var response = JSON.parse(data);
                if (response.start != 0) {
                    call_sync_ajax_lite(response.start)
                    $('#omni_sync_bt_lite').html("Syncing " + response.start + "/" + omniversepricing_total_products + " products")
                } else {
                    $(".omni-sync-loader").hide();
                    $('#omni_sync_bt_lite').html("Sync completed " + omniversepricing_total_products + " products")
                }
            }
        });
    }
});
