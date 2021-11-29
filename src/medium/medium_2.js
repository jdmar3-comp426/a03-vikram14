import mpg_data from "./data/mpg_data.js";
import {getStatistics} from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */

function avgOut(obj){
    obj.city=obj.city/mpg_data.length;
    obj.highway= obj.highway/mpg_data.length;

    return obj;
}
export const allCarStats = {
    avgMpg: avgOut(mpg_data.reduce(
        function (freq,currObj){
            return {...freq , 'city':(freq['city']||0)+currObj.city_mpg, 'highway': (freq['highway'] || 0)+currObj.highway_mpg};
        }, {})),
    allYearStats: getStatistics (mpg_data.reduce(
        function (acc, currObj){
            return [...acc, currObj.year]
        }, [])),
    ratioHybrids: mpg_data.reduce(
        function(acc,currObj){
            if(currObj.hybrid){
                acc+=1;
            }
            return acc;
        }, 0)/mpg_data.length,
};


/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */

export function transform(obj){
    return Object.keys(obj).reduce(
        function(acc,currKey){
            return [...acc, {"make":currKey,"hybrids":obj[currKey]}]
        },[]).sort((a,b)=>b.hybrids.length-a.hybrids.length);
}

export function transform1(obj){
   return Object.keys(obj).reduce(
        function(acc,key){
            return {...acc, [key]: {"hybrid": {"city":obj[key].hybrid.city/(obj[key].hybrid.count||1),"highway":obj[key].hybrid.highway/(obj[key].hybrid.count||1)},
                                "notHybrid":{"city":obj[key].notHybrid.city/(obj[key].notHybrid.count||1),"highway":obj[key].notHybrid.highway/(obj[key].notHybrid.count||1)}}}
        },{});

}

export const moreStats = {
    makerHybrids: transform(mpg_data.reduce(
        function(makes,currObj){
            if(currObj.hybrid)
                return {...makes, [currObj.make]: (makes[currObj.make]?[...makes[currObj.make], currObj.id] :[currObj.id]) };
            return makes;
        },{})),
    avgMpgByYearAndHybrid:transform1(mpg_data.reduce(
        function(acc, currObj){
            if(currObj.hybrid){
                return {...acc, [currObj.year]:{
                    "hybrid":{
                        "city":((acc[currObj.year] && acc[currObj.year].hybrid && acc[currObj.year].hybrid.city)?acc[currObj.year].hybrid.city:0) + currObj.city_mpg,
                        "highway":((acc[currObj.year] && acc[currObj.year].hybrid && acc[currObj.year].hybrid.highway)?acc[currObj.year].hybrid.highway:0) + currObj.highway_mpg,
                        "count":((acc[currObj.year] && acc[currObj.year].hybrid && acc[currObj.year].hybrid.count)?acc[currObj.year].hybrid.count:0) +1
                    },
                    "notHybrid": (acc[currObj.year] && acc[currObj.year].notHybrid)?acc[currObj.year].notHybrid: {"city":0,"highway":0,"count":0}
                }
            }
            }
            else{
                return {...acc, [currObj.year]:{
                    "hybrid": (acc[currObj.year] && acc[currObj.year].hybrid)?acc[currObj.year].hybrid: {"city":0,"highway":0,"count":0},
                    "notHybrid":{
                        "city":((acc[currObj.year] && acc[currObj.year].notHybrid && acc[currObj.year].notHybrid.city)?acc[currObj.year].notHybrid.city:0) + currObj.city_mpg,
                        "highway":((acc[currObj.year] && acc[currObj.year].notHybrid && acc[currObj.year].notHybrid.highway)?acc[currObj.year].notHybrid.highway:0) + currObj.highway_mpg,
                        "count":((acc[currObj.year] && acc[currObj.year].notHybrid && acc[currObj.year].notHybrid.count)?acc[currObj.year].notHybrid.count:0) +1
                    }
                }
            }
            }
        }, {})),
};
