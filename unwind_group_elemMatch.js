//db.restaurants.aggregate([ { $unwind: "$grades" }, { $group: { _id: "$borough", medium: {$avg: "$grades.score"},
    //$sort: {"medium": -1}} ])
db.restaurants.find({
    "grades": { 
        $elemMatch: {
            "grade": 'C',
            "score": {$lt: 40}
        }
    }
}, {_id: 0, name: 1, "grades.grade": 1, "grades.score": 1}
)