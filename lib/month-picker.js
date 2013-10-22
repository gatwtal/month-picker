/* 
 * The MIT License
 *
 * Copyright 2013 Martin Redlich.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function($){
    //plugin methods and defaults
    var currentDate = new Date();
    var dataKey = "gat-month-picker-data";
    var defaults = {
        startYear    : currentDate.getFullYear(),
        startMonth   : 1,
        afterInit    : null,
        afterUpdate  : null,
        monthNames   : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    };
    
    var methods = {
        init: function(options){
            var settings = $.extend({}, defaults, options);
            return $(this).each(function(){
                var $this = $(this);
                if($this.data(dataKey)){
                    return;
                }
                //the month picker hasn't been instantiated yet, so we do this now and store it in data
                var monthPicker = new MonthPicker($this, settings);
                $this.data(dataKey, monthPicker);
                if(options.afterInit && typeof(settings.afterInit) === 'function') settings.afterInit.call(this);
            });
        },
        destroy: function(){
            return $(this).each(function(){
                //destroy the object and remove it from data
                var $this = $(this);
                $this.data(dataKey).destroy();
                $this.removeData(dataKey);
            });
        },
        getYear: function(){
            return $(this).data(dataKey).getYear();
        },
        getMonth: function(){
            return $(this).data(dataKey).getMonth();
        }
    };
    
    //create the plugin within the jQuery namespace
    $.fn.monthPicker = function(args){
        if(methods[args]){
            return methods[args].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof args === 'object' || !args){
            return methods.init.apply(this, [args]);
        }
        else{
            $.error('Wrong usage of jQuery plugin monthPicker');
        }
    };
    
    //Month Picker class
    var MonthPicker = function(container, settings){
        var my = this;
        var selectedYear = settings.startYear;
        var selectedMonth = settings.startMonth;        
        var containerElement = container;
        var init = function(){
            //create the html structure and append it to the container element
            var monthPickerHtml = '<div class="gat-mp">\
                                    <div class="mpi">\
                                        <div class="h">\
                                            <div class="ls">&lt;</div>\
                                            <span>' + selectedYear.toString() + '</span>\
                                            <div class="rs">&gt;</div>\
                                        </div>\
                                        <div class="mns">\
                                            <div class="mns-i">';
            var selectedClass = '';
            for(var i = 0; i < settings.monthNames.length; i++){
                if(i === selectedMonth - 1) selectedClass = ' s';
                else selectedClass = '';
                monthPickerHtml += '<div class="m' + selectedClass + '">' + settings.monthNames[i] + '</div>';
            }
            monthPickerHtml += '             </div>\
                                        </div>\
                                    </div>\
                                </div>';
            containerElement.append(monthPickerHtml);
            bindEvents();
        };
        init();
        
        function bindEvents(){
            //click at year selectors
            $('.gat-mp .h .ls').on('click', function(){
                updateYear(-1);
            })
            $('.gat-mp .h .rs').on('click', function(){
                updateYear(1);
            });
            //click at a month
            $('.gat-mp .m').on('click', function(){
               updateMonth(this);
            });
        }
        
        function updateYear(increment){
            selectedYear += increment;
            //update the display
            $('.gat-mp .h span').html(selectedYear.toString());
            if(settings.afterUpdate && typeof(settings.afterUpdate) == 'function') settings.afterUpdate.call();
        }
        
        function updateMonth(selectedElement){
            //remove the selected class from all months
            $('.gat-mp .m').removeClass('s');
            //add it to the month which has been clicked
            $(selectedElement).addClass('s');
            //now refresh selectedMonth
            var counter = 0;
            $(selectedElement).parent().children().each(function(){
               counter += 1;
               if(this === selectedElement) return false;
            });
            selectedMonth = counter;
            if(settings.afterUpdate && typeof(settings.afterUpdate) == 'function') settings.afterUpdate.call();
        }
        
        this.getYear = function(){
            return selectedYear;
        };
        
        this.getMonth = function(){
            return selectedMonth;
        };
    };
})(jQuery);

