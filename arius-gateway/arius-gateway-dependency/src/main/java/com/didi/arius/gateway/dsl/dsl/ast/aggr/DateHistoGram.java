package com.didi.arius.gateway.dsl.dsl.ast.aggr;

import com.didi.arius.gateway.dsl.dsl.ast.common.KeyWord;
import com.didi.arius.gateway.dsl.dsl.ast.common.multi.NodeMap;
import com.didi.arius.gateway.dsl.dsl.visitor.basic.Visitor;

public class DateHistoGram extends KeyWord {

    public NodeMap m = new NodeMap();

    public DateHistoGram(String name) {
        super(name);
    }

    @Override
    public void accept(Visitor vistor) {
        vistor.visit(this);
    }


}